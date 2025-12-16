"""
Model Evaluation Script
This script evaluates the accuracy and performance of the sentiment analysis model.
"""

import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    precision_recall_fscore_support
)
import json
import os
from app import preprocess_comment

def load_model_and_vectorizer():
    """Load the trained model and vectorizer"""
    model_path = ".\\models\\lightgbm_model.pkl"
    vectorizer_path = ".\\models\\vectorizer.pkl"
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    if not os.path.exists(vectorizer_path):
        raise FileNotFoundError(f"Vectorizer file not found: {vectorizer_path}")
    
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
    
    print("OK: Model and vectorizer loaded successfully")
    return model, vectorizer

def evaluate_from_csv(csv_path, text_column='text', label_column='sentiment'):
    """
    Evaluate model using a CSV file with labeled data
    
    Args:
        csv_path: Path to CSV file with text and sentiment labels
        text_column: Name of the column containing text
        label_column: Name of the column containing sentiment labels (should be -1, 0, or 1)
    """
    print(f"\n{'='*60}")
    print("Loading test data from CSV...")
    print(f"{'='*60}")
    
    df = pd.read_csv(csv_path)
    
    if text_column not in df.columns:
        raise ValueError(f"Column '{text_column}' not found in CSV")
    if label_column not in df.columns:
        raise ValueError(f"Column '{label_column}' not found in CSV")
    
    texts = df[text_column].astype(str).tolist()
    true_labels = df[label_column].astype(int).tolist()
    
    print(f"Loaded {len(texts)} test samples")
    
    return evaluate_model(texts, true_labels)

def evaluate_from_json(json_path, text_key='text', label_key='sentiment'):
    """
    Evaluate model using a JSON file with labeled data
    
    Args:
        json_path: Path to JSON file with text and sentiment labels
        text_key: Key name for text in JSON objects
        label_key: Key name for sentiment labels in JSON objects
    """
    print(f"\n{'='*60}")
    print("Loading test data from JSON...")
    print(f"{'='*60}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    texts = []
    true_labels = []
    
    for item in data:
        if text_key in item and label_key in item:
            texts.append(str(item[text_key]))
            true_labels.append(int(item[label_key]))
    
    if len(texts) == 0:
        raise ValueError(f"No valid data found in JSON file. Expected keys: '{text_key}' and '{label_key}'")
    
    print(f"Loaded {len(texts)} test samples")
    
    return evaluate_model(texts, true_labels)

def evaluate_model(texts, true_labels):
    """
    Evaluate the model on given texts and true labels
    
    Args:
        texts: List of text strings
        true_labels: List of true sentiment labels (-1, 0, or 1)
    """
    print(f"\n{'='*60}")
    print("Evaluating Model...")
    print(f"{'='*60}")
    
    # Load model
    model, vectorizer = load_model_and_vectorizer()
    
    # Preprocess texts
    print("\nPreprocessing texts...")
    preprocessed_texts = [preprocess_comment(text) for text in texts]
    
    # Transform texts
    print("Vectorizing texts...")
    transformed_texts = vectorizer.transform(preprocessed_texts)
    
    # Make predictions
    print("Making predictions...")
    predictions = model.predict(transformed_texts)
    
    # Convert to integers for comparison
    predictions = [int(pred) for pred in predictions]
    true_labels = [int(label) for label in true_labels]
    
    # Calculate metrics
    accuracy = accuracy_score(true_labels, predictions)
    
    # Classification report
    print(f"\n{'='*60}")
    print("CLASSIFICATION REPORT")
    print(f"{'='*60}")
    print(classification_report(
        true_labels, 
        predictions, 
        target_names=['Negative (-1)', 'Neutral (0)', 'Positive (1)'],
        zero_division=0
    ))
    
    # Confusion Matrix
    print(f"\n{'='*60}")
    print("CONFUSION MATRIX")
    print(f"{'='*60}")
    cm = confusion_matrix(true_labels, predictions, labels=[-1, 0, 1])
    cm_df = pd.DataFrame(
        cm, 
        index=['Negative (-1)', 'Neutral (0)', 'Positive (1)'],
        columns=['Predicted -1', 'Predicted 0', 'Predicted 1']
    )
    print(cm_df)
    
    # Per-class metrics
    precision, recall, f1, support = precision_recall_fscore_support(
        true_labels, predictions, labels=[-1, 0, 1], zero_division=0
    )
    
    print(f"\n{'='*60}")
    print("DETAILED METRICS")
    print(f"{'='*60}")
    print(f"\nOverall Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"\nPer-class Metrics:")
    print(f"{'Class':<15} {'Precision':<12} {'Recall':<12} {'F1-Score':<12} {'Support':<10}")
    print("-" * 65)
    for i, label in enumerate([-1, 0, 1]):
        label_name = ['Negative', 'Neutral', 'Positive'][i]
        print(f"{label_name} ({label}):{'':<6} {precision[i]:<12.4f} {recall[i]:<12.4f} {f1[i]:<12.4f} {support[i]:<10}")
    
    # Calculate macro and weighted averages
    macro_precision = np.mean(precision)
    macro_recall = np.mean(recall)
    macro_f1 = np.mean(f1)
    weighted_precision = np.average(precision, weights=support)
    weighted_recall = np.average(recall, weights=support)
    weighted_f1 = np.average(f1, weights=support)
    
    print(f"\n{'='*60}")
    print("AVERAGE METRICS")
    print(f"{'='*60}")
    print(f"Macro Average Precision: {macro_precision:.4f}")
    print(f"Macro Average Recall: {macro_recall:.4f}")
    print(f"Macro Average F1-Score: {macro_f1:.4f}")
    print(f"\nWeighted Average Precision: {weighted_precision:.4f}")
    print(f"Weighted Average Recall: {weighted_recall:.4f}")
    print(f"Weighted Average F1-Score: {weighted_f1:.4f}")
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'support': support,
        'confusion_matrix': cm,
        'predictions': predictions,
        'true_labels': true_labels
    }

def quick_test():
    """
    Quick test with sample data to verify model is working
    """
    print(f"\n{'='*60}")
    print("QUICK TEST - Sample Predictions")
    print(f"{'='*60}")
    
    model, vectorizer = load_model_and_vectorizer()
    
    # Sample test cases
    test_cases = [
        ("This is amazing! I love it!", 1),
        ("It's okay, nothing special.", 0),
        ("This is terrible. Very disappointed.", -1),
        ("Great quality and fast delivery!", 1),
        ("The product broke after one day.", -1),
    ]
    
    texts = [case[0] for case in test_cases]
    expected = [case[1] for case in test_cases]
    
    preprocessed = [preprocess_comment(text) for text in texts]
    transformed = vectorizer.transform(preprocessed)
    predictions = [int(pred) for pred in model.predict(transformed)]
    
    print(f"\n{'Text':<40} {'Expected':<12} {'Predicted':<12} {'Match':<10}")
    print("-" * 80)
    
    correct = 0
    for text, exp, pred in zip(texts, expected, predictions):
        match = "OK" if exp == pred else "X"
        if exp == pred:
            correct += 1
        # Truncate text if too long and handle encoding
        text_display = text[:38].encode('ascii', 'ignore').decode('ascii')
        print(f"{text_display:<40} {exp:<12} {pred:<12} {match:<10}")
    
    accuracy = correct / len(test_cases)
    print(f"\nQuick Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Note: This is just a quick sanity check with 5 samples.")

if __name__ == "__main__":
    import sys
    
    print("\n" + "="*60)
    print("SENTIMENT ANALYSIS MODEL EVALUATION")
    print("="*60)
    
    # Check if test data file is provided
    if len(sys.argv) > 1:
        test_file = sys.argv[1]
        
        if test_file.endswith('.csv'):
            try:
                evaluate_from_csv(test_file)
            except Exception as e:
                print(f"\nERROR: Error evaluating from CSV: {e}")
                print("\nCSV format should have columns: 'text' and 'sentiment'")
                print("Sentiment values should be: -1 (negative), 0 (neutral), or 1 (positive)")
        elif test_file.endswith('.json'):
            try:
                evaluate_from_json(test_file)
            except Exception as e:
                print(f"\nERROR: Error evaluating from JSON: {e}")
                print("\nJSON format should be a list of objects with 'text' and 'sentiment' keys")
                print("Sentiment values should be: -1 (negative), 0 (neutral), or 1 (positive)")
        else:
            print(f"ERROR: Unsupported file format: {test_file}")
            print("Please provide a CSV or JSON file")
    else:
        print("\nWARNING: No test data file provided.")
        print("\nUsage:")
        print("  python evaluate_model.py <test_data.csv>")
        print("  python evaluate_model.py <test_data.json>")
        print("\nFile formats:")
        print("  CSV: Should have 'text' and 'sentiment' columns")
        print("  JSON: Should be a list of objects with 'text' and 'sentiment' keys")
        print("\nSentiment values: -1 (negative), 0 (neutral), 1 (positive)")
        print("\nRunning quick test with sample data instead...\n")
        quick_test()
        print("\n" + "="*60)
        print("To evaluate on your test data, provide a CSV or JSON file with labels")
        print("="*60)

