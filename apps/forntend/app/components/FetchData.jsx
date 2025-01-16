"use client"
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountStart, fetchAccountSuccess, fetchAccountFailure } from '../Redux/User/AccountSlice';
import { useParams } from 'next/navigation';

const FetchData = () => {
    const dispatch = useDispatch();
    const { userDetails } = useSelector(state => state.account);
    const { id } = useParams(); 

    useEffect(() => {
        const getUserDetails = async () => {
            dispatch(fetchAccountStart());
            try {
                const response = await fetch(`http://localhost:5000/api/balance/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const data = await response.json();
                if (!data) {
                    throw new Error('No data received from server');
                }

                const userData = {
                    ...data,
                    id: id
                };
                dispatch(fetchAccountSuccess(userData));
            } catch (err) {
                console.error('Error fetching data:', err.message);
                dispatch(fetchAccountFailure(err.message));
            }
        };

        if (id && (!userDetails || userDetails)) {
            getUserDetails();
        }
    }, [id, dispatch, userDetails]);

    return (
        <>
        </>
    );
}

export default FetchData;