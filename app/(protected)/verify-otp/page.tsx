import { Progress } from '@/components/ui/progress';
import VerifyOtp from '@/components/verify-otp/VerifyOtp';


const VerifyOtpPage = () => {
    return (
        <div className='max-w-4xl mx-auto w-full'>
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="text-[#DC3173] text-sm font-bold">
                        Step 2 of 3: <span className="font-medium">Verify your identity</span>
                    </div>
                    <div className="text-gray-500 text-xs font-medium">66% Complete</div>
                </div>
                <Progress value={66} className="h-2 bg-gray-100" />
            </div>
            <VerifyOtp />
        </div>
    );
};

export default VerifyOtpPage;