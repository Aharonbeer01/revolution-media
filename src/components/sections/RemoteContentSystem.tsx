import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";

const shotGuideRows = [
  {
    shot: "1",
    duration: "3-10s",
    what: "Bar exterior in golden light",
    how: "Tripod-still, wide. Lock exposure on the building before recording",
  },
  {
    shot: "2",
    duration: "3-10s",
    what: "Bartender selecting bottles and fresh garnish",
    how: "Medium close-up from the bar, 1x lens",
  },
  {
    shot: "3",
    duration: "3-10s",
    what: "Cocktail shake",
    how: "Two angles, side and front. 1080p at 60fps for slow motion",
  },
  {
    shot: "4",
    duration: "3-10s",
    what: "Pour into the glass",
    how: "Close-up, light coming through the liquid",
  },
  {
    shot: "5",
    duration: "3-10s",
    what: "Finished cocktail with sunset behind",
    how: "Low angle, backlit. Tap and hold to lock exposure on the glass",
  },
  {
    shot: "6",
    duration: "3-10s",
    what: "Sun touching the horizon",
    how: "Tripod-still, wide. Let the colours carry the frame",
  },
];

export function RemoteContentSystem() {
  return (
    <section
      id="remote-content-system"
      className="scroll-mt-24 bg-soft-white py-16 sm:py-20"
    >
      <Container>
        <FadeIn>
          <h2 className="max-w-4xl text-3xl font-bold text-midnight sm:text-4xl">
            The Remote Content System: World-Class Content, Filmed by Your Team
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-6 max-w-3xl space-y-5 leading-relaxed text-midnight/70">
            <p>
              Our film crew is based in South Africa. Our clients are not, and that
              has never stopped us. For international properties, we deliver the same
              content engine remotely: a seasonal content calendar built around your
              property&apos;s cycle, and detailed shot guides so precise that anyone
              on your team can film them on a smartphone.
            </p>
            <p>
              Each reel comes as a shot-by-shot table: what to film, for how long,
              from which angle, with which lens, and how to move. We calibrate
              everything to equipment your property can own for a few hundred dollars:
              a current smartphone and a mobile gimbal, with technical settings,
              framing, lighting, and even wind protection specified per shot. No
              filming experience required. If a shot needs a person and no guest is
              available, every guide includes a no-guest alternative, so the calendar
              never stalls.
            </p>
            <p>
              Your team films. We direct remotely, review the footage, edit, caption,
              and publish. The result is a content system indistinguishable from
              having a crew on site, at a fraction of the cost, running all year round
              on your island, lodge, or coastline.
            </p>
          </div>
        </FadeIn>

        {/* Sample shot guide */}
        <FadeIn delay={0.15}>
          <div className="mt-10 max-w-4xl">
            <h3 className="mb-4 text-lg font-bold text-midnight">
              From a real shot guide: Sunset Signature Cocktail (Reel, 40 to 50
              seconds)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-midnight/10 bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="bg-midnight text-soft-white">
                    <th className="px-4 py-3 text-left font-semibold text-gold">
                      Shot
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gold">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gold">
                      What to film
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gold">
                      How to film it
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shotGuideRows.map((row, i) => (
                    <tr
                      key={row.shot}
                      className={i % 2 === 0 ? "bg-white" : "bg-soft-white/50"}
                    >
                      <td className="px-4 py-3 font-semibold text-midnight">
                        {row.shot}
                      </td>
                      <td className="px-4 py-3 text-midnight/80">{row.duration}</td>
                      <td className="px-4 py-3 text-midnight/80">{row.what}</td>
                      <td className="px-4 py-3 text-midnight/80">{row.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-midnight/60">
              Every reel in your calendar comes with this level of instruction, plus a
              no-guest alternative for filming on quiet days.
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
