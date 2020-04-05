import React, { useRef } from "react"
import styled from "styled-components"
import _ from "lodash"
import { useSprings, animated } from "react-spring"
import { useDrag } from "react-use-gesture"

import { SEO } from "components/SEO"
import { Layout } from "components/Layout"

const PagerWrapper = styled(animated.div)`
  border: 1px dotted purple;
  overscroll-behavior-y: contain;
  margin: 0;
  padding: 0;
  height: 50%;
  width: 100%;
  user-select: none;
  position: fixed;
  overflow: hidden;
`
const PagerGestureHandler = styled(animated.div)`
  border: 3px dotted red;
  position: absolute;
  width: 50%;
  height: 50%;
  willchange: transform;
`

const PagerItem = styled(animated.div)`
  border: 3px dashed green;
  height: 100%;
  width: 100%;
`

export default function Viewpager() {
  const { props, bind, pages } = usePager()
  return (
    <>
      <SEO title="View Pager" />
      <Layout>
        Test
        <PagerWrapper>
          {props.map(({ x, display, scale }, i) => (
            <PagerGestureHandler
              {...bind()}
              key={i}
              style={{
                display,
                x,
              }}
            >
              <PagerItem
                style={{ scale, backgroundImage: `url(${pages[i]})` }}
              />
            </PagerGestureHandler>
          ))}
        </PagerWrapper>
      </Layout>
    </>
  )
}

const usePager = (
  width = window.innerWidth / 2,
  pages = [
    "https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    "https://images.pexels.com/photos/296878/pexels-photo-296878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  ]
) => {
  const index = useRef(0)
  const [props, set] = useSprings(pages.length, (i) => ({
    x: i * width,
    scale: 1,
    display: "block",
  }))
  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
      if (down && distance > width) {
        cancel()

        index.current = _.clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          pages.length - 1
        )
      }

      set((i) => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: "none" }
        const x = (i - index.current) * width + (down ? mx : 0)
        const scale = down ? 1 - distance / width : 1
        return { x, scale, display: "block" }
      })
    }
  )
  return { props, bind, pages }
}
