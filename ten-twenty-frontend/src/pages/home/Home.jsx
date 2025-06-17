import Header from '../../components/Header'
import AnimatedSlider from '../../components/AnimatedSlider'
import HorizontalCardSlider from '../../components/HorizontalCardSlider'

export default function Home() {
  return (
    <div className='relative w-full min-h-screen'>
      <div className='absolute inset-0'>
        <AnimatedSlider />
        <HorizontalCardSlider />
      </div>
      <div className='absolute inset-x-0 top-0 z-10 px-3 py-2'>
        <Header />
      </div>
    </div>
  );
}
