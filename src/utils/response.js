// src/utils/response.js

/**
 * Function to format response
 * @param {string} status - The status of the response (error, success, etc.)
 * @param {Array|Object} data - The data to send in the response
 * @param {string} message - The message to send in the response
 * @returns {Object} - Formatted response object
 */
const formatResponse = (status, data, message) => {
    return {
        status,
        data,
        message
    };
};

module.exports = formatResponse;
