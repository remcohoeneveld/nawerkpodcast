import { useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { parse } from 'rss-to-json'
import ReactHtmlParser from 'react-html-parser';

import { useAudioPlayer } from '@/components/AudioProvider'
import { Container } from '@/components/Container'
import { FormattedDate } from '@/components/FormattedDate'
import {PlayButton} from "@/components/player/PlayButton";

function PlayPauseIcon({ playing, ...props }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" fill="none" {...props}>
      {playing ? (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.496 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H2.68a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H1.496Zm5.82 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H8.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H7.316Z"
        />
      ) : (
        <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z" />
      )}
    </svg>
  )
}

function EpisodeEntry({ episode }) {
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
    <article
      aria-labelledby={`episode-${episode.id}-title`}
      className="py-10 sm:py-12"
    >
      <Container>
        <div className="flex flex-col items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-6 mt-4">
              <PlayButton player={player} size="large"/>
              <h2
                id={`episode-${episode.id}-title`}
                className="mt-2 text-2xl font-bold text-brand-blue hover:text-brand-blue-900"
              >
                <Link href={`/${episode.id}`}>{episode.title}</Link>
              </h2>
            </div>
          </div>
          <FormattedDate
            date={date}
            className="order-first font-mono text-sm leading-7 text-slate-500"
          />
          <p className="mt-1 text-base leading-7 text-slate-700">
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Link
              href={`/${episode.id}`}
              className="flex items-center text-sm font-bold leading-6 text-brand-blue hover:text-brand-blue-900 active:text-brand-blue-900"
              aria-label={`Show notes for episode ${episode.title}`}
            >
              Show notes
            </Link>
          </div>
        </div>
      </Container>
    </article>
  )
}

export default function Home({ episodes }) {
  return (
    <>
      <Head>
        <title>
          Nawerk Podcast - De podcast voor nawerk.
        </title>
        <meta
          name="description"
          content="Nawerk, de podcast voor na werk. Verschillende gastprekers vertellen over hun passie in hun werk, wat ze doen en hoe ze daar een verschil maken."
        />
      </Head>
      <div className="pt-16 pb-12 sm:pb-4 lg:pt-12">
        <Container>
          <h1 className="text-4xl font-bold leading-7 text-brand-blue">
            Episodes
          </h1>
        </Container>
        <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
          {episodes.map((episode) => (
            <EpisodeEntry key={episode.id} episode={episode} />
          ))}
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  let feed = await parse('https://anchor.fm/s/c3398550/podcast/rss')

  if (feed === null) {
    return {props: {episodes: [], revalidate: 10}}
  }

  return {
    props: {
      episodes: feed.items.map(
        ({ id, title, description, enclosures, published }) => ({
          id,
          title: `${title}`,
          published,
          description,
          audio: enclosures.map((enclosure) => ({
            src: enclosure.url,
            type: enclosure.type,
          }))[0],
        })
      ),
    },
    revalidate: 10,
  }
}
