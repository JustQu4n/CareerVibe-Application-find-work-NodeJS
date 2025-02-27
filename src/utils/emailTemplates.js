const applicationStatusTemplate = (jobSeekerName, jobTitle, status) => {
    return `
        <h1>Application Status Update</h1>
        <p>Dear ${jobSeekerName},</p>
        <p>We wanted to inform you that the status of your application for the position of <strong>${jobTitle}</strong> has been updated to <strong>${status}</strong>.</p>
        <p>Thank you for your interest in our company.</p>
        <p>Best regards,</p>
        <p>Your Company Name</p>
    `;
};

const congratulatoryEmailTemplate = (jobSeekerName, jobTitle) => {
    return `
        <h1>Congratulations!</h1>
        <p>Dear ${jobSeekerName},</p>
        <p>We are pleased to inform you that you have successfully passed the CV screening stage for the position of <strong>${jobTitle}</strong>.</p>
        <p>We were impressed with your qualifications and experience, and we would like to invite you to the next stage of our recruitment process.</p>
        <p>Our team will be in touch with you shortly to provide further details and schedule an interview.</p>
        <p>Thank you for your interest in our company, and we look forward to speaking with you soon.</p>
        <p>Best regards,</p>
        <p>Your Company Name</p>
    `;
};

module.exports = { applicationStatusTemplate, congratulatoryEmailTemplate };