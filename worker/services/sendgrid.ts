export class SendgridService
{
    private readonly BASE_URL = 'https://api.sendgrid.com/v3/mail/send';
    
    private apiKey: string;

    constructor(apiKey: string)
    {
        this.apiKey = apiKey;
    }

    async sendEmail(email: string, subject: string, html: string)
    {
        const response = await fetch(this.BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [
                            {
                                email: email,
                            }
                        ],
                    },
                ],
                from: {
                    email: 'noreply@convesio.com',
                },
                subject: subject,
                content: [
                    {
                        type: 'text/html',
                        value: html,
                    },
                ],
            }),
        });

        return response.json();
    }
}