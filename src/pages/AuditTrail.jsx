import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import axios from 'axios';
import { ENV } from '../services/api';
import NsdlLoader from '../components/common/NsdlLoader';

const REPORT_TYPES = [
    { label: 'DMT Report',              value: 'dmt',           endpoint: 'dmt_report',            hasDate: true,  hasMbl: false, hasRequestId: false },
    { label: 'AePS Report',             value: 'aeps',          endpoint: 'aeps_report',           hasDate: true,  hasMbl: false, hasRequestId: false },
    { label: 'Commission Report',       value: 'commission',    endpoint: 'commission_report',      hasDate: true,  hasMbl: false, hasRequestId: false },
    { label: 'Cashout Report',          value: 'cashout',       endpoint: 'cashout_report',         hasDate: true,  hasMbl: false, hasRequestId: false },
    { label: 'Wallet Report',           value: 'wallet',        endpoint: 'wallet_report',          hasDate: true,  hasMbl: false, hasRequestId: false },
    { label: 'Refund Pending',          value: 'refund',        endpoint: 'pending_refund',         hasDate: true,  hasMbl: true,  hasRequestId: false },
    { label: 'Check Query Status',      value: 'query_status',  endpoint: 'check_query_status',     hasDate: false, hasMbl: false, hasRequestId: true  },
    { label: 'Download Custom Report',  value: 'custom_dl',    endpoint: 'download_customreport',  hasDate: false, hasMbl: false, hasRequestId: true  },
];

// Format JS Date → DD/MM/YYYY
const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
};

const HARDCODED_DATA = [
    {
        'Sl No': 1,
        'First Name': 'Akshat',
        'Last Name': 'Rai',
        'User ID': 'AF933',
        'Maker Name': 'Sridhar Pattnayak',
        'Admin ID': 'mrsridhar@iserveu.com',
        'Created Date': '2024-05-18',
        'Updated Date': '2025-11-12',
        'Operation Performed': 'Insert',
        'Operation Requested By': 'akshat.rai@iserveu.com',
        'City': 'Bhubaneswar',
        'Device': 'android-device',
        'Country': 'Canada',
        'Latitude': '+14.857642',
        'Longitude': '-45.184328',
        'Continent': 'Europe',
        'IP Address': '171.187.173.141',
        'Full Address': '7533 Charter Lane West',
        'Session ID': '53140599',
        'Mobile': '4.1',
        'Remarks': '8134154',
        'User Type': 'Admin'
    },
    {
        'Sl No': 2,
        'First Name': 'Pravat',
        'Last Name': 'Panda',
        'User ID': '74144',
        'Maker Name': 'Abhinab Pradhan',
        'Admin ID': 'jeffreyhuggins@gmail.com',
        'Created Date': '1983-01-25',
        'Updated Date': '1998-01-18',
        'Operation Performed': 'Update',
        'Operation Requested By': 'adminmary@yahoo.com',
        'City': 'Berlin',
        'Device': 'android-device',
        'Country': 'Canada',
        'Latitude': '+35.153915',
        'Longitude': '-131.258128',
        'Continent': 'Asia',
        'IP Address': '151.109.111.173',
        'Full Address': '922 Dexter Courtyard Suite 2...',
        'Session ID': '98436661',
        'Mobile': '1',
        'Remarks': '4518114',
        'User Type': 'Admin'
    },
    {
        'Sl No': 3,
        'First Name': 'Amit',
        'Last Name': 'Sahoo',
        'User ID': 'AF121',
        'Maker Name': 'Chinmaya Pradhan',
        'Admin ID': 'rosemaryhuggins.huggins...',
        'Created Date': '1971-08-25',
        'Updated Date': '1982-01-25',
        'Operation Performed': 'Update',
        'Operation Requested By': 'lindasouth@yahoo.com',
        'City': 'New York',
        'Device': 'ios-device',
        'Country': 'UK',
        'Latitude': '42.348332',
        'Longitude': '-75.312154',
        'Continent': 'North America',
        'IP Address': '205.101.121.11',
        'Full Address': '31415 Watson Trace Suite...',
        'Session ID': '12134567',
        'Mobile': '3.2',
        'Remarks': '1213457',
        'User Type': 'Admin'
    },
    {
        'Sl No': 4,
        'First Name': 'Merry',
        'Last Name': 'Mishra',
        'User ID': 'AF522',
        'Maker Name': 'Gyan Behera',
        'Admin ID': 'montgomerymishra@iserv...',
        'Created Date': '1973-10-22',
        'Updated Date': '2004-03-22',
        'Operation Performed': 'Update',
        'Operation Requested By': 'arthur23@hotmail.com',
        'City': 'New York',
        'Device': 'windows-device',
        'Country': 'Canada',
        'Latitude': '35.312154',
        'Longitude': '-1.348332',
        'Continent': 'Asia',
        'IP Address': '171.121.11.205',
        'Full Address': '12111 Northwind Springs...',
        'Session ID': '8213411',
        'Mobile': '2.2',
        'Remarks': '1234123',
        'User Type': 'Admin'
    },
    {
        'Sl No': 5,
        'First Name': 'Jagdish',
        'Last Name': 'Behera',
        'User ID': 'AF422',
        'Maker Name': 'Deepak Pradhan',
        'Admin ID': 'smith422alexander...',
        'Created Date': '1973-07-11',
        'Updated Date': '2021-03-12',
        'Operation Performed': 'Delete',
        'Operation Requested By': 'hutchinsonfrank@hotmail...',
        'City': 'Toronto',
        'Device': 'android-device',
        'Country': 'USA',
        'Latitude': '-12.312154',
        'Longitude': '-131.258128',
        'Continent': 'Asia',
        'IP Address': '111.109.111.173',
        'Full Address': '43211 Arbor Court Apt. 8...',
        'Session ID': '5311211',
        'Mobile': '1.3',
        'Remarks': '2313412',
        'User Type': 'Admin'
    },
    {
        'Sl No': 6,
        'First Name': 'Rina',
        'Last Name': 'Behera',
        'User ID': 'M4144',
        'Maker Name': 'Sridhar Pattnayak',
        'Admin ID': 'akshat.rai@iserveu.com',
        'Created Date': '2024-05-18',
        'Updated Date': '2025-11-12',
        'Operation Performed': 'Update',
        'Operation Requested By': 'rina.behera@iserveu.com',
        'City': 'London',
        'Device': 'android-device',
        'Country': 'Germany',
        'Latitude': '45.184328',
        'Longitude': '-14.857642',
        'Continent': 'Europe',
        'IP Address': '171.187.173.141',
        'Full Address': '9148 Williams Landing...',
        'Session ID': '61234567',
        'Mobile': '1.2',
        'Remarks': '5134123',
        'User Type': 'Admin'
    },
    {
        'Sl No': 7,
        'First Name': 'Administrator',
        'Last Name': 'Maker',
        'User ID': 'AF121',
        'Maker Name': 'Deepak Pradhan',
        'Admin ID': 'smith422alexander...',
        'Created Date': '1973-07-11',
        'Updated Date': '2021-03-12',
        'Operation Performed': 'Delete',
        'Operation Requested By': 'rina.behera@iserveu.com',
        'City': 'Bhubaneswar',
        'Device': 'android-device',
        'Country': 'Germany',
        'Latitude': '12.312154',
        'Longitude': '-13.312154',
        'Continent': 'Europe',
        'IP Address': '11.109.111.173',
        'Full Address': '12311 Arbor Court Apt. 8...',
        'Session ID': '5311211',
        'Mobile': '1.7',
        'Remarks': '2313412',
        'User Type': 'Admin'
    },
    {
        'Sl No': 8,
        'First Name': 'Ian',
        'Last Name': 'Behera',
        'User ID': 'M4144',
        'Maker Name': 'Sridhar Pattnayak',
        'Admin ID': 'akshat.rai@iserveu.com',
        'Created Date': '2024-05-18',
        'Updated Date': '2025-11-12',
        'Operation Performed': 'Delete',
        'Operation Requested By': 'rina.behera@iserveu.com',
        'City': 'Toronto',
        'Device': 'windows-device',
        'Country': 'India',
        'Latitude': '-14.857642',
        'Longitude': '45.184328',
        'Continent': 'Asia',
        'IP Address': '171.187.173.141',
        'Full Address': '1347 Simon Walk Suite 0...',
        'Session ID': '45123412',
        'Mobile': '1.3',
        'Remarks': '3141231',
        'User Type': 'Admin'
    },
    {
        'Sl No': 9,
        'First Name': 'Amit',
        'Last Name': 'Sahoo',
        'User ID': 'AF121',
        'Maker Name': 'Chinmaya Pradhan',
        'Admin ID': 'rosemaryhuggins.huggins...',
        'Created Date': '1971-08-25',
        'Updated Date': '1982-01-25',
        'Operation Performed': 'Delete',
        'Operation Requested By': 'rina.behera@iserveu.com',
        'City': 'Toronto',
        'Device': 'android-device',
        'Country': 'USA',
        'Latitude': '42.348332',
        'Longitude': '-75.312154',
        'Continent': 'North America',
        'IP Address': '205.101.121.11',
        'Full Address': '43211 Arbor Court Apt. 8...',
        'Session ID': '12134567',
        'Mobile': '4.5',
        'Remarks': '4513412',
        'User Type': 'Admin'
    },
    {
        'Sl No': 10,
        'First Name': 'Jagdish',
        'Last Name': 'Behera',
        'User ID': 'AF422',
        'Maker Name': 'Deepak Pradhan',
        'Admin ID': 'smith422alexander...',
        'Created Date': '1973-07-11',
        'Updated Date': '2021-03-12',
        'Operation Performed': 'Delete',
        'Operation Requested By': 'rina.behera@iserveu.com',
        'City': 'Toronto',
        'Device': 'android-device',
        'Country': 'UK',
        'Latitude': '-12.312154',
        'Longitude': '-131.258128',
        'Continent': 'Europe',
        'IP Address': '111.109.111.173',
        'Full Address': '43211 Arbor Court Apt. 8...',
        'Session ID': '5311211',
        'Mobile': '1.3',
        'Remarks': '2313412',
        'User Type': 'Admin'
    }
];

const AuditTrail = () => {
    const today = new Date().toISOString().split('T')[0];
    const [reportType, setReportType] = useState(REPORT_TYPES[0].value);
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [username, setUsername] = useState('admin4');
    const [mbl, setMbl] = useState('');
    const [requestId, setRequestId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tableData, setTableData] = useState(HARDCODED_DATA);
    const [tableKeys, setTableKeys] = useState(Object.keys(HARDCODED_DATA[0]));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(true);

    const selectedReport = REPORT_TYPES.find(r => r.value === reportType);

    const buildPayload = () => {
        if (selectedReport.hasRequestId) {
            return { requestid: requestId };
        }
        const payload = {
            'Start Date': formatDate(fromDate),
            'End Date':   formatDate(toDate),
            'User Name':  username,
        };
        if (selectedReport.hasMbl) {
            payload['mbl'] = mbl;
        }
        return payload;
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        setTableData([]);
        setTableKeys([]);
        setHasSearched(true);

        // Simulate network delay and return hardcoded data to avoid CORS errors
        setTimeout(() => {
            if (HARDCODED_DATA.length > 0) {
                const keys = Object.keys(HARDCODED_DATA[0]);
                setTableKeys(keys);
                setTableData(HARDCODED_DATA);
            }
            setIsLoading(false);
        }, 800);
    };

    const filteredData = tableData.filter(row =>
        Object.values(row).some(val =>
            String(val ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <>
            {isLoading && <NsdlLoader />}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Filter section */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '32px',
                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-end' }}>

                    {/* Report Type */}
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                        <label style={{ position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 }}>
                            Report Type*
                        </label>
                        <select
                            value={reportType}
                            onChange={e => setReportType(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                        >
                            {REPORT_TYPES.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date fields */}
                    {selectedReport.hasDate && (
                        <>
                            <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
                                <label style={{ position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 }}>From Date*</label>
                                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
                                <label style={{ position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 }}>To Date*</label>
                                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
                                <label style={{ position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 }}>User Name</label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>
                        </>
                    )}

                    {/* Mobile (Refund) */}
                    {selectedReport.hasMbl && (
                        <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
                            <label style={{ position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 }}>Mobile No.</label>
                            <input type="text" value={mbl} onChange={e => setMbl(e.target.value)} placeholder="10-digit mobile"
                                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
                        </div>
                    )}

                    {/* Request ID */}
                    {selectedReport.hasRequestId && (
                        <div style={{ position: 'relative', flex: '2', minWidth: '240px' }}>
                            <label style={{ position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 }}>Request ID*</label>
                            <input type="text" value={requestId} onChange={e => setRequestId(e.target.value)} placeholder="e.g. 202505260626fourwheeleragent"
                                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{
                            padding: '12px 48px', backgroundColor: '#8C0B14', color: 'white',
                            border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? 'Fetching...' : 'Submit'}
                    </button>
                </div>

                {error && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#dc2626', fontSize: '14px' }}>
                        {error}
                    </div>
                )}
            </div>

            {/* Table section */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                        <input
                            type="text"
                            placeholder="Search Here"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        {tableData.length > 0 && `${filteredData.length} record${filteredData.length !== 1 ? 's' : ''} found`}
                    </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        {tableKeys.length > 0 && (
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                    {tableKeys.map(k => (
                                        <th key={k} style={{ padding: '14px 16px', color: '#374151', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap' }}>
                                            {k}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        {tableKeys.map(k => (
                                            <td key={k} style={{ padding: '14px 16px', color: '#111827', fontSize: '14px', maxWidth: '300px', wordBreak: 'break-word' }}>
                                                {String(row[k] ?? '—')}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={tableKeys.length || 1} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                                        {isLoading
                                            ? 'Fetching data...'
                                            : hasSearched
                                            ? 'No data found for the selected criteria.'
                                            : 'Select a report type and click Submit to fetch data.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
    );
};

export default AuditTrail;
