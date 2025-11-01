import React from 'react';

import { API_BASE_URL } from './config';

const LineLoginPage = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', background: '#f8f9fc' }}>
      <h2 className="mb-4">🔐 Login ด้วย LINE</h2>
      <a className="btn btn-success btn-lg" href={`${API_BASE_URL}/login`}>
        ➡️ Login with LINE
      </a>    </div>
  );
};

export default LineLoginPage;