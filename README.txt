PodcastPWD — Apps Script with Email Notification

- Use this script instead of the previous code.gs if you want email notifications.
- It stores the submission in the Google Sheet (tab: Submissions) and sends an email to podcastpwd@talbiya.sa.

Deployment notes:
1) Open your Google Sheet -> Extensions -> Apps Script.
2) Replace existing code with code_email.gs content.
3) Deploy (New deployment): Web app, Execute as Me, Access: Anyone with the link.
4) Copy the URL to forms.js (ENDPOINT_URL).
5) First submission will ask permissions for Sheets/Mail -> approve.

Customize:
- Change 'notifyEmail' at the top if you want multiple recipients (e.g., 'a@x.sa,b@y.sa').
