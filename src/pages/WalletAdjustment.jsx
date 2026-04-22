import React, { useState } from 'react';
import { requestEncrypted, ENV } from '../services/api';
import NsdlLoader from '../components/common/NsdlLoader';

const WalletAdjustment = () => {
    const [searchUser, setSearchUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchUser) return;
        
        setLoading(true);
        setMessage('Starting Process...');
        
        try {
            // Step 1: Fetch Feature
            const featurePayload = {
                feature_name: "nsdl_report_query",
                bankcode: "nsdl"
            };
            const featureRes = await requestEncrypted(`${ENV.featureBase}/fetchFeature`, featurePayload);
            const workflowId = featureRes?.features?.[0]?.workflow_id || 'NSDL_Report_Query_V1';
            
            setMessage(`Found Workflow: ${workflowId}. Starting instance...`);

            // Step 2: Start Process Instance
            // Using standard test dates since the UI only asks for User Name
            const today = new Date();
            const lastMonth = new Date(); lastMonth.setMonth(today.getMonth() - 1);
            
            const formatDate = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

            const processParams = {
                applicationSource: "web",
                bpmnId: workflowId,
                processVariables: {
                    reportQueryRequest: {
                        start_date: formatDate(lastMonth),
                        end_date: formatDate(today),
                        user_name: searchUser,
                        report_name: "Wallet"
                    }
                }
            };
            
            await requestEncrypted(`${ENV.camundaBase}/startProcessInstance`, processParams);

            setMessage('Instance started. Searching tasks...');

            // Step 3: Search Process Instances
            const searchParams = {
                processSearchQuery: {
                    filter: {
                        processDefinitionId: { "$eq": workflowId },
                        state: { "$in": ["ACTIVE","COMPLETED"] },
                        variables: [
                            { name: "userTaskAssignee", value: { "$eq": `"${searchUser}"` } },
                            { name: "report_name", value: { "$eq": `"Wallet"` } }
                        ]
                    },
                    sort: [{ field: "startDate", order: "DESC" }],
                    page: { limit: 10 }
                },
                fetchVariables: ["reportQueryRequest", "reportStatus", "requestId"]
            };

            const searchRes = await requestEncrypted(`${ENV.camundaBase}/searchProcessInstances`, searchParams);
            
            if (searchRes?.items) {
                setResults(searchRes.items);
                setMessage('');
            } else {
                setMessage('No processes found.');
            }

        } catch (error) {
            console.error(error);
            setMessage('Failed to execute Camunda cycle. Please check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <NsdlLoader />}
            <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                Wallet Adjustment
            </h3>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <input 
                        type="text" 
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        placeholder="User Name*"
                        required
                        style={{
                            width: '100%',
                            padding: '12px 15px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                    {!searchUser && (
                        <div style={{
                            position: 'absolute',
                            bottom: '-25px',
                            left: '5px',
                            backgroundColor: '#333',
                            color: 'white',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '4px'
                        }}>
                            Please fill out this field.
                        </div>
                    )}
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    style={{
                        backgroundColor: '#a33333', // Slightly muted red for the button
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '12px 30px',
                        fontSize: '14px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {message && <p style={{ marginTop: '20px', color: '#666' }}>{message}</p>}

            {results.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '12px' }}>Process ID</th>
                                <th style={{ padding: '12px' }}>State</th>
                                <th style={{ padding: '12px' }}>Start Date</th>
                                <th style={{ padding: '12px' }}>Report Status</th>
                                <th style={{ padding: '12px' }}>Request ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{item.processDetail?.processInstanceKey}</td>
                                    <td style={{ padding: '12px' }}>{item.processDetail?.state}</td>
                                    <td style={{ padding: '12px' }}>{new Date(item.processDetail?.startDate).toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '12px', 
                                            fontSize: '12px',
                                            backgroundColor: item.processVariables?.reportStatus === 'Finished' ? '#e6f4ea' : '#fff3e0',
                                            color: item.processVariables?.reportStatus === 'Finished' ? '#1e8e3e' : '#e67c73'
                                        }}>
                                            {item.processVariables?.reportStatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>{item.processVariables?.requestId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </>
    );
};

export default WalletAdjustment;
