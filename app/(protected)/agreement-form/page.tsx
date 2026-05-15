import AgreementForm from '@/components/agreement/AgreementForm';
import { Progress } from '@/components/ui/progress';
import React from 'react';

const AgreementFormPage = () => {
    return (
        <div className='max-w-4xl mx-auto w-full'>
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="text-[#DC3173] text-sm font-bold">
                        Step 1 of 3: <span className="font-medium">Basic Information</span>
                    </div>
                    <div className="text-gray-500 text-xs font-medium">33% Complete</div>
                </div>
                <Progress value={33} className="h-2 bg-gray-100" />
            </div>
            <AgreementForm />
        </div>
    );
};

export default AgreementFormPage;