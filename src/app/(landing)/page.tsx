import dynamic from 'next/dynamic';

const Template = dynamic(
    () => import('@/components/templates/LandingTemplate'),
    {
        loading: () => <div>Loading...</div>,
    }
);

const Page = () => {
    return <Template />;
};

export default Page;
