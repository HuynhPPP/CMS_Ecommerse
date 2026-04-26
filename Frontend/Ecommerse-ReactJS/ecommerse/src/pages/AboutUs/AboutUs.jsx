import { useState } from 'react';
import MyFooter from '@components/Footer/Footer';
import MyHeader from '@components/Header/Header';
import MainLayout from '@components/Layout/Layout';
import AccordionMenu from '@components/AccordionMenu';
import styles from './styles.module.scss';
import Brands from '@/pages/AboutUs/components/Brand/Brands';

import imgAbout1 from '@assets/images/About/Image1.jpg';
import imgAbout2 from '@assets/images/About/Image2.jpg';
import imgAbout3 from '@assets/images/About/Image3.jpg';

function AboutUs() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    container,
    functionBox,
    specialText,
    btnBack,
    containerTitle,
    line,
    title,
    textS,
    textL,
    containerContent,
    description,
    faqSection,
    accordionList,
  } = styles;

  const dataContents = [
    {
      id: '1',
      url: imgAbout1,
      description:
        'Ac eget cras augue nisi neque lacinia in aliquam. Odio pellentesque sed ultrices dolor amet nunc habitasse proin consec. tur feugiat egestas eget.',
    },
    {
      id: '2',
      url: imgAbout2,
      description:
        'Arcu volutpat sollicitudin sapien sit justo tellus eu fames aenean. Faucibus at eu nulla adipiscing. Ipsum a morbi tortor ullamcorper sit semper.',
    },
    {
      id: '3',
      url: imgAbout3,
      description:
        'Nibh luctus eu dignissim sit. Lorem netus ultrices neque elementum. Et convallis consectetur lacus luctus iaculis quisque sed.',
    },
  ];

  const faqData = [
    {
      id: 0,
      question: 'Feugiat purus mi nisl dolor pellentesque tellus?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      id: 1,
      question:
        'Suspendisse nunc sagittis adipiscing imperdiet turpis sodales massa convallis sit?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 2,
      question: 'Facilisis adipiscing lacus, nisl at in consectetur in?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 3,
      question: 'Pellentesque egestas eget amet erat leo arcu?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 4,
      question:
        'Pellentesque pulvinar nibh suspendisse faucibus libero condimentum phasellus.',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 5,
      question: 'Hendrerit commodo id mattis consequat.',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  return (
    <>
      <MyHeader />
      <MainLayout>
        <div className={container}>
          <div className={functionBox}>
            <div>
              Home &gt; <span className={specialText}>About us</span>
            </div>
            <div className={btnBack} onClick={() => handleBackPrePage()}>
              &lt; Return to previous page
            </div>
          </div>

          <div className={containerTitle}>
            <div className={line} />
            <div className={title}>
              <div className={textS}>we try our best for you</div>
              <div className={textL}>Welcome to the Marseille04 Shop</div>
            </div>
          </div>

          <div className={containerContent}>
            {dataContents.map((item) => (
              <div key={item.id}>
                <img src={item.url} alt='' />
                <div className={description}>{item.description}</div>
              </div>
            ))}
          </div>

          <Brands />

          <div className={containerTitle}>
            <div className={line} />
            <div className={title}>
              <div className={textS}>we are happy to help you</div>
              <div className={textL}>Have Any Questions?</div>
            </div>
          </div>

          <div className={faqSection}>
            <div className={accordionList}>
              {faqData.map((faq) => (
                <AccordionMenu
                  key={faq.id}
                  titleMenu={faq.question}
                  contentAccordion={faq.answer}
                  isSelected={selectedIndex === faq.id}
                  onClick={() =>
                    setSelectedIndex(selectedIndex === faq.id ? -1 : faq.id)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
      <MyFooter />
    </>
  );
}

export default AboutUs;
