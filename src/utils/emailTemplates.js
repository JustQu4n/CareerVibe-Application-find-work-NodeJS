const applicationStatusTemplate = (jobSeekerName, jobTitle, status) => {
    return `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <h2 style="color: #2c3e50;">Application Status Update</h2>
            <p>Dear ${jobSeekerName},</p>
            <p>We hope this message finds you well.</p>
            <p>
                We would like to inform you that the status of your application for the position of 
                <strong>${jobTitle}</strong> has been updated to <strong>${status}</strong>.
            </p>
            <p>
                We truly appreciate the time and effort you invested in applying for this role. 
                Our recruitment team has carefully reviewed your application and this update reflects our current progress.
            </p>
            <p>
                If you have any questions or need further information, please do not hesitate to contact us.
            </p>
            <p>Thank you once again for your interest in joining our team.</p>
            <p>Best regards,</p>
            <p><strong>Human Resources Department</strong><br>Your Company Name</p>
        </div>
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