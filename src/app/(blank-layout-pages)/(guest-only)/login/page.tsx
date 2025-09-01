import SplashScreen from '@/components/ui/splash-screen';
import dynamic from 'next/dynamic';

const Template = dynamic(() => import('@/components/templates/LoginTemplate'), {
    loading: () => <SplashScreen />,
});
const Page = () => {
    return <Template />;
};

export default Page;
