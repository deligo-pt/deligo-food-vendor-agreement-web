import AgreementViewer from '@/components/agreement/AgreementViewer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getSingleAgreement } from '@/services/agreement.service';
import { Calendar, FileText, ShieldCheck } from 'lucide-react';

interface IProps {
    searchParams: Promise<{ agreementId: string }>;
}


const AgreementViewerPage = async ({ searchParams }: IProps) => {
    const agreementId = (await searchParams).agreementId || "";
    const { data } = await getSingleAgreement(agreementId);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto p-4">
            {/* Left Sidebar: Overview */}
            <div className="lg:col-span-3 space-y-6">
                <Card className="border-none shadow-sm bg-white p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Agreement Overview</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        Please review the commercial partnership agreement carefully before final submission.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                            <FileText className="w-4 h-4 text-[#DC3173]" />
                            v2.4 Final Draft
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                            <Calendar className="w-4 h-4 text-[#DC3173]" />
                            Due: May 15, 2026
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                            <ShieldCheck className="w-4 h-4 text-[#DC3173]" />
                            Legally Verified
                        </div>
                    </div>
                </Card>

                {/* Final Step Instructions */}
                <div className="bg-[#DC3173] rounded-xl p-6 text-white shadow-md">
                    <h4 className="font-bold text-sm mb-3">Final Step</h4>
                    <ul className="text-[11px] space-y-2 opacity-90 list-decimal pl-4">
                        <li>Review all contract terms</li>
                        <li>Click Submit Agreement below</li>
                        <li>A copy will be sent to your email</li>
                    </ul>
                </div>
            </div>

            {/* Right Content: PDF Viewer */}
            <div className="lg:col-span-9 space-y-4">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="text-[#DC3173] text-sm font-bold">
                            Step 3 of 3: <span className="font-medium">Final Round</span>
                        </div>
                        <div className="text-gray-500 text-xs font-medium">99% Complete</div>
                    </div>
                    <Progress value={99} className="h-2 bg-gray-100" />
                </div>

                {/* PDF Display Area */}
                <AgreementViewer pdfUrl={data?.draftPdfPath || ''} />
            </div>
        </div>
    );
};

export default AgreementViewerPage;