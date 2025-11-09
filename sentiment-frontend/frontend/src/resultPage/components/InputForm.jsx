import React, { useState } from 'react'
import { fetchRepliesFromUrl } from '../../api';
import '../styles/inputForm.css'
import Input from '../../utils/Input_Box';

function InputForm({ onAnalysisRequest ,setIsLoading}) {

    const [postUrl, setPostUrl] = useState("");
    const [error, setError] = useState("");

    // handle the url submission
    const handleUrlSubmit = async () => {
        if (!postUrl) {
            setError('Please enter a URL.');
            return;
        }
        setError('');

        try {
            const replies = await fetchRepliesFromUrl(postUrl);
            onAnalysisRequest(replies);
        } catch (error) {
            setError(error.message || 'Failed to fetch the replies');
        }
    };

    // handle the file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        console.log(file)
        setError('');
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const comments = JSON.parse(e.target.result);
                if (!Array.isArray(comments)) {
                    throw new Error("JSON file must contain an array of comments.");
                }
                setIsLoading(true)
                console.log(comments)
                onAnalysisRequest(comments); // Send the parsed comments to the parent
                console.log(comments)
            } catch (err) {
                console.log("there is a error ",err)
                setError('Error parsing JSON file. Ensure it is a valid array of strings.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className='inputBox-container'>
            < Input
            onsubmit={handleUrlSubmit}
            onFileUpload={handleFileUpload}
            value={postUrl}
            onchange={(e)=>setPostUrl(e.target.value)}
        />
        </div>
    )
}

export default InputForm;



// <div className='input-section'>
//             <div className='api-input'>
//                 <input
//                     type="text"
//                     placeholder='Enter the post url'
//                     className='url-input'
//                     value={postUrl}
//                     onChange={(e) => setPostUrl(e.target.value)}
//                 />
//                 <button onClick={handleUrlSubmit} className='analyze-button'>Analyze</button>
//             </div>

//             <div className='divider'>
//                 <span>Or</span>
//             </div>
//             {/* file upload */}

//             <div className='file-upload'>
//                 <label htmlFor="file-upload" className='file-upload-label'>
//                     Upload a .json file of comments
//                 </label>

//                 <input
//                     id='file-upload'
//                     type='file'
//                     accept='.json'
//                     onChange={handleFileUpload}
//                 />
//             </div>
//         </div>
