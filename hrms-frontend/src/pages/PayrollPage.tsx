// src/pages/PayrollPage.tsx
import React, { useState, useEffect } from 'react';

// Import the API functions
import { initiatePayroll } from '../api/hr';
import { getAllPayrolls } from '../api/payroll';
import type { PayrollData } from '../api/payroll';

// This component is the new "Payroll Tab"
const PayrollPage: React.FC = () => {
    const [payrolls, setPayrolls] = useState<PayrollData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInitiating, setIsInitiating] = useState(false);

    const fetchPayrolls = async () => {
        try {
            setLoading(true);
            const data = await getAllPayrolls();
            // Sort by creation date, newest first
            data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setPayrolls(data);
        } catch (err) {
            console.error("Failed to fetch payrolls", err);
            alert("Failed to fetch payroll history.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchPayrolls();
    }, []);

    const handleInitiatePayroll = async () => {
        if (isInitiating) return;

        if (!window.confirm("Are you sure you want to initiate payroll for the entire company?")) {
            return;
        }

        setIsInitiating(true);
        try {
            const res = await initiatePayroll();
            alert(res.message || "Payroll initiated successfully! The new run will appear as 'PENDING'.");

            // Wait a moment for the new record to be created, then refresh
            setTimeout(() => {
                fetchPayrolls();
            }, 2000); // 2-second delay

        } catch (err) {
            console.error("Failed to initiate payroll", err);
            alert("Failed to initiate payroll.");
        } finally {
            setIsInitiating(false);
        }
    };

    return (
        <div>
        <h2 style= { styles.tabTitle } > Payroll Management </h2>
            < div style = { styles.payrollControls } >
                <button onClick={ handleInitiatePayroll } disabled = { isInitiating } >
                    { isInitiating? 'Initiating...': 'Initiate Company Payroll' }
                    </button>
                    < button onClick = { fetchPayrolls } disabled = { loading } style = {{ marginLeft: '1rem' }
}>
    { loading? 'Refreshing...': 'Refresh List' }
    </button>
    </div>

    < h3 style = { styles.tableTitle } > Payroll History </h3>
{ loading && <p>Loading payroll history...</p> }
{
    !loading && payrolls.length === 0 && (
        <p>No payroll history found.</p>
      )
}
{
    !loading && payrolls.length > 0 && (
        <table style={ styles.payrollTable }>
            <thead>
            <tr>
            <th>Run ID </th>
                < th > Status </th>
                < th > Total Employees </th>
                    < th > Gross Amount </th>
                        < th > Net Amount </th>
                            < th > Date Created </th>
                                </tr>
                                </thead>
                                <tbody>
    {
        payrolls.map(payroll => (
            <tr key= { payroll.id } >
            <td>{ payroll.id } </td>
            < td >
            <span style={ styles.statusTag(payroll.status) } >
            { payroll.status }
            </span>
            </td>
            < td > { payroll.total_employees } </td>
            < td > ${ payroll.gross_amount.toLocaleString() } </td>
            < td > ${ payroll.net_amount.toLocaleString() } </td>
            < td > { new Date(payroll.createdAt).toLocaleString() } </td>
        </tr>
        ))
    }
    </tbody>
        </table>
      )
}
</div>
  );
};

// --- STYLES ---
// These styles are self-contained for the PayrollPage component.
const styles = {
    tabTitle: {
        marginTop: 0,
        borderBottom: '1px solid #eee',
        paddingBottom: '0.5rem',
        color: '#333',
    },
    payrollControls: {
        margin: '1rem 0',
    },
    tableTitle: {
        marginTop: '2rem',
        borderBottom: '1px solid #ddd',
        paddingBottom: '0.5rem'
    },
    payrollTable: {
        width: '100%',
        borderCollapse: 'collapse' as 'collapse',
        marginTop: '1rem',
        '& th, & td': { // This may not render correctly with inline styles, consider CSS
            border: '1px solid #ddd',
            padding: '12px',
            textAlign: 'left' as 'left',
            color: '#333',
        },
        '& th': {
            backgroundColor: '#f4f4f4',
        },
        '& tr:nth-child(even)': {
            backgroundColor: '#f9f9f9',
        }
    } as React.CSSProperties, // Cast to base style type
    statusTag: (status: string): React.CSSProperties => ({
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'white',
        backgroundColor: status === 'COMPLETED' ? '#28a745' : (status === 'PENDING' ? '#ffc107' : '#dc3545'),
    }),
};


export default PayrollPage;