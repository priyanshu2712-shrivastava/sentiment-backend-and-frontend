import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000';


const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};


// fetches the post replies form api
export const fetchRepliesFromUrl = async (postId) => {

    const X_API_BEARER_TOKEN = 'BEARER_TOKEN';

    const response = await axios.post(`${API_URL}/fetch-replies`, {
        post_id: postId,
        bearer_token: X_API_BEARER_TOKEN
    },
        axiosConfig
    );
    return response.data.replies;
}

// Analyze list of comments
// export const analyzeSentiments = async (comments) => {
//     const response = await axios.post(`${API_URL}/predict`, {
//         comments: comments
//     },
//         axiosConfig
//     );
//     return response.data;
// };

export const analyzeSentiments = async (comments) => {
    const response = await axios.post(`${API_URL}/predict`, {
        comments: comments
    },
        axiosConfig
    );
    return response.data; // This returns an array of {comment, sentiment} objects
};


// generate sentiment chart
export const generateChart = async (sentimentCounts) => {
    const response = await axios.post(`${API_URL}/generate_chart`, {
        sentiment_counts: sentimentCounts,
    },
        axiosConfig
    );
    return response.data;
};


// Generates a word cloud image from a list of comments.
export const generateWordCloud = async (comments) => {
    try {
        console.log('Sending comments to wordcloud API:', comments); // Debug log
        const response = await axios.post(
            `${API_URL}/generate_wordcloud`,
            { comments },
            axiosConfig
        );
        console.log('Wordcloud API response:', response.data); // Debug log
        return response.data.words;
    } catch (error) {
        console.error('Error generating word cloud:', error);
        throw new Error('Failed to generate word cloud: ' + error.message);
    }
};
