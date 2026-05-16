
import VerifyOtp from '@/components/verify-otp/VerifyOtp';

interface IProps {
    searchParams: Promise<{ email: string }>;
}

const VerifyOtpPage = async ({ searchParams }: IProps) => {

    return (
        <>
            <VerifyOtp email={(await searchParams).email || ""} />
        </>
    );
};

export default VerifyOtpPage;