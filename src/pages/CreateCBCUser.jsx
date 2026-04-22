import React, { useState } from 'react';
import { requestPlain, requestEncrypted, ENV } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import NsdlLoader from '../components/common/NsdlLoader';

const CreateCBCUser = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        // Basic Info
        firstName: '', middleName: '', lastName: '', mobileNumber: '', email: '',
        // Business Details
        companyName: '', ceoName: '', gstNumber: '', institutionType: 'PRIVATE_LIMITED',
        pan: '', numberOfStaff: '', faxNumber: '',
        // Localizing Pincode Info (Standard practice for these forms)
        pinCode: '', state: '', district: '', city: '',
        // Bank Details
        accountNumber: '',
        // Other Details
        affiliationFee: '', stdCode: '', telephoneNumber: '',
        agreementFromDate: '', agreementToDate: '',
        entityPanCard: '', incorporationAddress: '',
        productFeatures: ['ACCOUNT_OPENING'],
        termsAccepted: false
    });

    const [files, setFiles] = useState({
        bankResolution: null,
        authorizedSignatoryKyc: null,
        certificateOfIncorporation: null,
        firstPageAgreement: null,
        lastPageAgreement: null,
        businessProposal: null
    });

    const [fileUrls, setFileUrls] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles && selectedFiles[0]) {
            setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
        }
    };

    const uploadFile = async (fileKey) => {
        const file = files[fileKey];
        if (!file) return null;

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('orgname', 'nsdlab_user-onboarding_prod');
        uploadData.append('username', user?.username || 'admin');

        try {
            // Using direct axios since FormData doesn't like the encrypted wrapper interceptor
            const response = await fetch('https://api-preprod.txninfra.com/storage/isu/bucket/api/v1/isu-internal/nsdlab_user-onboarding_stag/upload', {
                method: 'POST',
                body: uploadData
            });
            const data = await response.json();
            // Assuming the API returns an ID or path in 'id' or 'url'
            return data.id || data.url || file.name; 
        } catch (error) {
            console.error(`Upload failed for ${fileKey}`, error);
            throw new Error(`Failed to upload ${fileKey}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            alert("Please accept the terms and conditions.");
            return;
        }

        setIsLoading(true);
        setMessage('Uploading documents...');

        try {
            // 1. Upload Files
            const uploadedPaths = {};
            for (const key in files) {
                if (files[key]) {
                    uploadedPaths[key] = await uploadFile(key);
                }
            }
            setFileUrls(uploadedPaths);

            // 2. Construct Payload
            const payload = {
                reqType: "CREATE",
                bankCode: "NSDL",
                cbcDetails: {
                    BasicInformation: {
                        firstName: formData.firstName,
                        middleName: formData.middleName,
                        lastName: formData.lastName,
                        mobileNumber: formData.mobileNumber,
                        email: formData.email,
                        country: "India",
                        state: formData.state,
                        district: formData.district,
                        city: formData.city,
                        pinCode: formData.pinCode
                    },
                    BusinessDetails: {
                        numberOfStaff: formData.numberOfStaff,
                        faxNumber: formData.faxNumber,
                        businessAddress: formData.incorporationAddress, // simplified mapping
                        ceoName: formData.ceoName,
                        companyName: formData.companyName,
                        gstNumber: formData.gstNumber,
                        institutionType: formData.institutionType,
                        pan: formData.pan,
                        latitude: "0",
                        longitude: "0"
                    },
                    AdminDetails: {
                        adminName: formData.firstName + " " + formData.lastName,
                        adminEmail: formData.email,
                        adminMobileNumber: formData.mobileNumber
                    },
                    BankDetails: {
                        accountNumber: formData.accountNumber,
                        bankResolution: uploadedPaths.bankResolution || ""
                    },
                    OtherDetails: {
                        affiliationFee: formData.affiliationFee,
                        telephoneNumber: `${formData.stdCode}-${formData.telephoneNumber}`,
                        entityId: "",
                        agreementStartDate: formData.agreementFromDate,
                        agreementEndDate: formData.agreementToDate,
                        entityPanCard: formData.entityPanCard,
                        authorizedSignatoryKyc: uploadedPaths.authorizedSignatoryKyc || "",
                        certificateOfIncorporationDocumentPdf: uploadedPaths.certificateOfIncorporation || "",
                        incorporationAddress: formData.incorporationAddress,
                        firstAndLastPageAgreement: uploadedPaths.firstPageAgreement || "",
                        lastPageAgreement: uploadedPaths.lastPageAgreement || "",
                        productFeatures: formData.productFeatures,
                        termsAndConditions: "Y",
                        businessProposal: uploadedPaths.businessProposal || ""
                    }
                }
            };

            const url = `https://apidev.iserveu.online/NSDL/user-onboarding/cbc-onboard`;
            const response = await requestEncrypted(url, payload);
            
            setMessage('CBC User Created Successfully!');
            alert('CBC User Created Successfully!');
            handleReset();
        } catch (error) {
            console.error(error);
            setMessage('Failed to create CBC user. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            firstName: '', middleName: '', lastName: '', mobileNumber: '', email: '',
            companyName: '', ceoName: '', gstNumber: '', institutionType: 'PRIVATE_LIMITED',
            pan: '', numberOfStaff: '', faxNumber: '', pinCode: '', state: '', district: '', city: '',
            accountNumber: '', affiliationFee: '', stdCode: '', telephoneNumber: '',
            agreementFromDate: '', agreementToDate: '', entityPanCard: '',
            incorporationAddress: '', productFeatures: ['ACCOUNT_OPENING'], termsAccepted: false
        });
        setFiles({
            bankResolution: null, authorizedSignatoryKyc: null,
            certificateOfIncorporation: null, firstPageAgreement: null,
            lastPageAgreement: null, businessProposal: null
        });
    };

    const renderInput = (label, name, placeholder, required = false, type = 'text') => (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
            <input 
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px', 
                    fontSize: '14px',
                    boxSizing: 'border-box'
                }}
            />
        </div>
    );

    const renderFileUpload = (label, name, required = false) => (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
            <div style={{ 
                border: '1px dashed #d1d5db', 
                borderRadius: '8px', 
                padding: '12px', 
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
            }}>
                <span style={{ fontSize: '18px' }}>📎</span>
                <input 
                    type="file" 
                    name={name}
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ flex: 1, fontSize: '13px' }}
                    required={required}
                />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>(.pdf Only)</span>
            </div>
        </div>
    );

    return (
        <>
            {isLoading && <NsdlLoader />}
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '40px' }}>
                        {renderInput('First Name', 'firstName', 'Enter First Name', true)}
                        {renderInput('Middle Name', 'middleName', 'Enter Middle Name')}
                        {renderInput('Last Name', 'lastName', 'Enter Last Name', true)}
                        {renderInput('CEO Name', 'ceoName', 'Enter CEO Name', true)}
                        {renderInput('Company Name', 'companyName', 'Enter Company Name', true)}
                        {renderInput('Email ID', 'email', 'Enter Email ID', true, 'email')}
                        {renderInput('PAN', 'pan', 'Enter PAN', true)}
                        {renderInput('Mobile Number', 'mobileNumber', 'Enter Mobile Number', true)}
                        {renderInput('Account Number', 'accountNumber', 'Enter Account Number', true)}
                        {renderInput('GST Number', 'gstNumber', 'Enter GST Number', true)}
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                Institution Type <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <select 
                                name="institutionType" 
                                value={formData.institutionType} 
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                            >
                                <option value="PRIVATE_LIMITED">Private Limited</option>
                                <option value="PUBLIC_LIMITED">Public Limited</option>
                                <option value="PROPRIETORSHIP">Proprietorship</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                Telephone Number <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="text" name="stdCode" value={formData.stdCode} onChange={handleChange} placeholder="STD Code" style={{ width: '30%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
                                <input type="text" name="telephoneNumber" value={formData.telephoneNumber} onChange={handleChange} placeholder="Telephone Number" style={{ width: '70%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
                            </div>
                        </div>

                        {renderInput('Affiliate Fee', 'affiliationFee', 'Enter Affiliate Fee', true)}
                        {renderInput('Number of Staff', 'numberOfStaff', 'Enter Number of Staff', true)}
                        {renderInput('Agreement From Date', 'agreementFromDate', '', true, 'date')}
                        {renderInput('Agreement To Date', 'agreementToDate', '', true, 'date')}
                        {renderInput('Entity PAN Card', 'entityPanCard', 'Enter Entity PAN Card', true)}
                        {renderInput('Incorporation Address Line 1', 'incorporationAddress', 'Enter Address', true)}
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                Product Features <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                                <option>ACCOUNT_OPENING</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '40px', marginTop: '20px' }}>
                        {renderFileUpload('Bank Resolution', 'bankResolution', true)}
                        {renderFileUpload('Authorized Signatory KYC', 'authorizedSignatoryKyc', true)}
                        {renderFileUpload('Certificate of Incorporation', 'certificateOfIncorporation', true)}
                        {renderFileUpload('First Page of Agreement', 'firstPageAgreement', true)}
                        {renderFileUpload('Last Page of Agreement', 'lastPageAgreement', true)}
                        {renderFileUpload('Business Proposal', 'businessProposal', true)}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <input 
                            type="checkbox" 
                            name="termsAccepted" 
                            checked={formData.termsAccepted} 
                            onChange={handleChange}
                            style={{ marginTop: '4px' }}
                        />
                        <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                            By using our services, you confirm that you are at least 18 years old and legally capable of entering into agreements...
                            [Privacy Policy terms text matching image]
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                        <button 
                            type="button" 
                            onClick={handleReset}
                            style={{ 
                                padding: '10px 32px', 
                                border: '1px solid #8C0B14', 
                                borderRadius: '6px', 
                                color: '#8C0B14', 
                                backgroundColor: 'white', 
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Reset
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{ 
                                padding: '10px 32px', 
                                border: 'none', 
                                borderRadius: '6px', 
                                color: 'white', 
                                backgroundColor: '#8C0B14', 
                                fontWeight: 'bold',
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
                {message && <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>{message}</p>}
            </div>
        </div>
        </>
    );
};

export default CreateCBCUser;
