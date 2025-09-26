import React, { useEffect, useState } from 'react';
import { getTestData } from '../api';

function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        getTestData().then((res) => setData(res));
    }, []);

    return (
        <div>
            <h2>Backend Data:</h2>
            <pre>{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
        </div>
    );
}

export default Dashboard;
