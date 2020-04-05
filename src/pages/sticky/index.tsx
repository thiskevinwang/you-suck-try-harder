import { SEO } from "components/SEO"
import { Layout } from "components/Layout"

function Sticky() {
  return (
    <>
      <SEO title="Sticky" />
      <Layout>
        <main>
          <section>
            <div
              style={{
                display: "flex",
                verticalAlign: `baseline`,
                background: `rgba(200,100,100,0.5)`,
              }}
            >
              <article
                style={{
                  display: "block",
                  background: "brown",
                  flex: 1,
                }}
              >
                {Array(10)
                  .fill(null)
                  .map((_e, i) => (
                    <div
                      key={i}
                      style={{
                        margin: `1rem`,
                        background: `lightblue`,
                        height: 100,
                      }}
                    >
                      hi
                    </div>
                  ))}
              </article>
              <figure
                style={{
                  display: "block",
                  background: "orange",
                  height: `50vh`,
                  top: 200,
                  margin: 0,
                  marginBottom: 30,
                  padding: `1rem`,
                  position: `sticky`,
                  flex: 1,
                }}
              >
                I should be sticky
              </figure>
            </div>
          </section>
          <section>
            <div
              style={{
                display: "flex",
                verticalAlign: `baseline`,
                background: `rgba(200,100,100,0.5)`,
              }}
            >
              <article
                style={{
                  display: "block",
                  background: "brown",
                  flex: 1,
                }}
              >
                {Array(10)
                  .fill(null)
                  .map((_e, i) => (
                    <div
                      key={i}
                      style={{
                        margin: `1rem`,
                        background: `green`,
                        height: 100,
                      }}
                    >
                      hi
                    </div>
                  ))}
              </article>
              <figure
                style={{
                  display: "block",
                  background: "yellow",
                  height: `50vh`,
                  top: 200,
                  margin: 0,
                  padding: `1rem`,
                  position: `sticky`,
                  flex: 1,
                }}
              >
                I should be sticky
              </figure>
            </div>
          </section>
        </main>
      </Layout>
    </>
  )
}

export default Sticky
