import React, { useState } from 'react';

const EmailTestForm: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState<'' | 'success' | 'error'>((''));
  const [response, setResponse] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setResponse('');

    try {
      const res = await fetch('/api/webhooks/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('success');
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setMessage('error');
        setResponse(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setMessage('error');
      setResponse('An unexpected error occurred.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Send Test Email</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">To:</label>
          <input
            type="email"
            id="to"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject:</label>
          <input
            type="text"
            id="subject"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body (HTML):</label>
          <textarea
            id="body"
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Send Email
        </button>
      </form>
      {message === 'success' && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-semibold">Email sent successfully!</p>
          <pre className="whitespace-pre-wrap text-sm">{response}</pre>
        </div>
      )}
      {message === 'error' && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error sending email:</p>
          <pre className="whitespace-pre-wrap text-sm">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default EmailTestForm;
