import React, { useState } from 'react';
import { postData } from '../util/api';

const AdminPanel = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            console.log('No file selected');
            return;
        }

        // Create a new FormData object
        const formData = new FormData();

        // Append the file to the FormData object
        formData.append('image', file);
        console.log(formData);
        // Make the fetch request
        fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response data
                console.log(data);
            })
            .catch((error) => {
                // Handle any errors
                console.log(error);
            });
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default AdminPanel;