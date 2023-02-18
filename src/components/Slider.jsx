import clsx from 'clsx'
import PropTypes from "prop-types";
import Marquee from "react-fast-marquee";


/**
 * The text slider content
 *
 * @returns {JSX.Element}
 *   Returns the text slider content.
 */
function TextSliderContent() {
  return (
    <>
      <div className="pr-16 pl- items-center pl-8 pr-8 text-3xl font-medium tracking-[-0.02em] uppercase text-white">
        Nawerk Podcast
      </div>
    </>
  );
}

export function Slider({className, ...props}) {
  return (
    <div className="py-10 block lg:hidden sm:py-12 bg-gradient-to-r from-black bg-brand-blue">
      <div className="lg:max-w-4xl">
        <Marquee className="" gradient={false} speed={50}>
          <div className="inline-flex overflow-y-hidden">
            <TextSliderContent/>
            <TextSliderContent/>
            <TextSliderContent/>
            <TextSliderContent/>
            <TextSliderContent/>
            <TextSliderContent/>
            <TextSliderContent/>
            <TextSliderContent/>
          </div>
        </Marquee>
      </div>
    </div>
  )
}
