import AgreementViewer from '@/components/agreement/AgreementViewer';
import { getSingleAgreement } from '@/services/agreement.service';

interface IProps {
    searchParams: Promise<{ agreementId: string }>;
}


const AgreementViewerPage = async ({ searchParams }: IProps) => {
    const agreementId = (await searchParams).agreementId || "";
    const data = await getSingleAgreement(agreementId);

    return (
        <>
            <AgreementViewer agreement={data} />
        </>
    );
};

export default AgreementViewerPage;