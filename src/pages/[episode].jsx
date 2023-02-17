import { useMemo } from 'react'
import Head from 'next/head'
import { parse } from 'rss-to-json'

import { useAudioPlayer } from '@/components/AudioProvider'
import { Container } from '@/components/Container'
import { FormattedDate } from '@/components/FormattedDate'
import { PlayButton } from '@/components/player/PlayButton'
import ReactHtmlParser from "react-html-parser";

function Description({ episode }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row">
      <div className="max-w-xl flex-auto">
        <div
          className="prose text-base leading-7 text-gray-600"
          dangerouslySetInnerHTML={{__html: episode.description}}
        />
      </div>
      <img className="h-auto m-auto hidden md:block sm:max-w-[15rem] md:max-w-[13rem] w-auto flex-none rounded-2xl object-contain mt-0" src={episode.itunes_image.href} alt=""/>
    </div>
  )
}

export default function Episode({ episode }) {
  const regex = /(<([^>]+)>)/ig;
  const clean_description = episode.description.replace(regex, '');

  let date = new Date(episode.published)

  let audioPlayerData = useMemo(
    () => ({
      title: episode.title,
      audio: {
        src: episode.audio.src,
        type: episode.audio.type,
      },
      link: `/${episode.id}`,
    }),
    [episode]
  )
  let player = useAudioPlayer(audioPlayerData)

  return (
    <>
      <Head>
        <title>{`${episode.title} - Nawerk Podcast`}</title>
        <meta name="description" content={clean_description} />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"></link>
      </Head>
      <article className="py-16 lg:py-36">
        <Container>
          <header className="flex flex-col">
            <div className="flex items-center gap-6">
              <PlayButton player={player} size="large" />
              <div className="flex flex-wrap">
                <h1 className="mt-2 text-2xl md:text-4xl font-bold text-black">
                  {episode.title}
                </h1>
                <FormattedDate
                  date={date}
                  className="order-first font-mono text-sm leading-7 text-slate-500"
                />
              </div>
            </div>
          </header>
          <hr className="my-12 border-gray-200" />
          <Description episode={episode}/>
        </Container>
      </article>
    </>
  )
}

export async function getStaticProps({ params }) {
  let feed = await parse('https://anchor.fm/s/c3398550/podcast/rss')
  let episode = feed.items
    .map(({ id, title, description, itunes_image, enclosures, published }) => ({
      id: id.toString(),
      title: `${title}`,
      description,
      itunes_image,
      published,
      audio: enclosures.map((enclosure) => ({
        src: enclosure.url,
        type: enclosure.type,
      }))[0],
    }))
    .find(({ id }) => id === params.episode)

  if (!episode) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      episode,
    },
    revalidate: 10,
  }
}

export async function getStaticPaths() {
  let feed = await parse('https://anchor.fm/s/c3398550/podcast/rss')

  return {
    paths: feed.items.map(({ id }) => ({
      params: {
        episode: id.toString(),
      },
    })),
    fallback: 'blocking',
  }
}
