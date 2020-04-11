import styled, { BaseProps } from "styled-components"

import { animated } from "react-spring"

import { Spacer } from "components/Spacer"
import { Total, Sends } from "../styles"

export const StatusBars = ({ springs, refs }) => {
  return (
    <>
      {[...springs].reverse().map((props, i) => {
        const grade = refs.length - 1 - i
        return (
          <FlexRowAlignCenter key={i}>
            <VGrade>
              <small>V{grade}</small>
            </VGrade>
            <Spacer x={10} />
            <animated.div // container for percentage bars
              style={{
                display: `flex`,
                width: props.total.to((a) => (a + 2) * 30),
              }}
            >
              <Total style={{ width: props.totalWidth }}>
                <Sends style={{ width: props.sendWidth, ...props }}></Sends>
              </Total>
              <Spacer x={5} />
              <small style={{ minWidth: 60 }} ref={refs[i]}>
                ?
              </small>
            </animated.div>
          </FlexRowAlignCenter>
        )
      })}
    </>
  )
}

const FlexRowAlignCenter = styled.div`
  display: flex;
  align-items: center;
`

const VGrade = styled(animated.div)`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dotted ${(p: BaseProps) => p.theme.commentRenderer.borderColor};
  border-radius: 50%;
  margin-top: 2px;
  margin-bottom: 2px;
`
