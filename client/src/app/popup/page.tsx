"use client";

import Popup from '@/components/Popup';
import React, { useState } from 'react';

export default function PopupPage() {
    const [showPopup, setShowPopup] = useState(true);

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            {showPopup && <Popup onClose={handleClosePopup} />}
        </div>
    );
}
