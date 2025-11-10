'use client'

export default function Home() {
  return (
    <main className="bg-primary-dark text-primary-light">
      {/* SECTION 1: HERO */}
      <section className="h-screen w-full bg-primary-dark flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-h1 text-accent-orange mb-6">THEY'RE CONNING YOU, MATE.</h1>
          <p className="text-2xl font-semibold mb-6 opacity-90">
            Your storyboard tool just made you think you're being productive. It's brilliant at that. The problem is, you're not.
          </p>
          <p className="text-body-lg opacity-80 max-w-2xl mx-auto">
            Your Adobe. Your Firefly. Whatever the hell you're using to knock out storyboards. They've convinced you that this grinding, tedious, repetitive process that eats your day is somehow speeding you up. Here's the brutal truth: they've found a way to make you feel like you're winning whilst your actual creativity slowly suffocates in the background.
          </p>
        </div>
      </section>

      {/* SECTION 2: THE LIE */}
      <section className="min-h-screen w-full bg-primary-light text-primary-dark py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 mb-12">PRODUCTIVITY THEATRE</h2>
          <div className="space-y-6 text-body">
            <p>You get it every time. "Look how fast you can create storyboards now!" they scream. Faster templates. Smarter suggestions. AI that finishes your thoughts before you've even finished thinking them.</p>
            <p>And yeah, sure — you knock out a board in 45 minutes instead of an hour. You save maybe 10 minutes here, 15 minutes there. Brilliant. Absolutely brilliant. Except nobody's asking the question that matters: what the fuck are you actually losing in those minutes you're saving?</p>
            <p>See, here's what the tools don't tell you. They're not selling you productivity. They're selling you the feeling of productivity. The sensation that you're moving fast, ticking boxes, getting things done. It's intoxicating. It feels like progress. And all the while, they've quietly removed the space where actual creativity lives. The moments where your brain wanders, makes unexpected connections, spots solutions that the algorithm would never suggest.</p>
            <p>They've turned storyboarding into a chore with a fresh coat of paint. And they've made you feel grateful for it.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: RESEARCH FINDINGS */}
      <section className="min-h-screen w-full bg-primary-dark py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 mb-4">WHAT WE FOUND</h2>
          <div className="mb-12 text-body opacity-90">
            <p>A while back, we started digging into why so many brilliant creative minds felt hollow using modern storyboard tools. Not frustrated with features. Not complaining about interface design. Something deeper. A sense that the tools were doing something to them rather than for them. We started asking the right questions. Here's what we uncovered.</p>
          </div>
          <div className="space-y-12">
            <div>
              <h3 className="text-h4 mb-4">The Cognitive Load Trap</h3>
              <p className="text-body opacity-90">Current tools force creatives into two roles simultaneously: creative director AND production assistant. You're trying to imagine a shot, build it visually, and navigate a labyrinth of menus and options all at once. Your brain's cognitive load explodes. The best ideas get lost not because they're bad — but because your attention got hijacked by rendering options or template selection. The tools promise to handle the grunt work. What they actually do is introduce new grunt work disguised as features.</p>
            </div>
            <div>
              <h3 className="text-h4 mb-4">The Template Ceiling</h3>
              <p className="text-body opacity-90">Templates feel helpful until you realise they're actually training wheels that never come off. Every board you make gets subtly nudged toward what the tool can do easily rather than what your story actually needs. You start self-censoring. "That idea's too complicated for this tool." "We'll do that a different way." You're not making creative decisions anymore — you're making tool-compatible decisions. Slowly, imperceptibly, your work gets smaller.</p>
            </div>
            <div>
              <h3 className="text-h4 mb-4">The Collaboration Illusion</h3>
              <p className="text-body opacity-90">"Real-time collaboration!" they promised. What you got: everyone fighting over the same file, versions spiralling out of control, feedback drowning in threaded comments that nobody reads. Tools built for efficiency instead of creativity. Tools that make it easier to share a board than to actually think through a board with your team. The collaboration doesn't deepen — it just gets faster and lonelier.</p>
            </div>
            <div>
              <h3 className="text-h4 mb-4">The Missing Space</h3>
              <p className="text-body opacity-90">Here's the one nobody talks about. Great creative work needs space. Space to breathe. Space to sit with an idea that isn't fully formed yet. Space to sketch something bad before it becomes something good. Modern storyboard tools are fast. They're smooth. They're polished. They don't leave any room for the mess. And the mess is where creativity actually lives.</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-700 text-body opacity-90">
            <p>We realised we weren't looking at a tools problem. We were looking at a philosophy problem. Every major storyboarding platform was built on the same assumption: make it faster, make it easier, get it done. And none of them stopped to ask: but at what cost to the creative process itself?</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE GAP */}
      <section className="min-h-screen w-full bg-primary-light text-primary-dark py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 mb-12">WHY IT ALL BREAKS DOWN</h2>
          <div className="space-y-6 text-body">
            <p>So everyone else in the industry is out there obsessing about features. More templates. Faster rendering. Better AI suggestions. Plugin integrations. They're optimizing for the wrong thing entirely.</p>
            <p>They're solving the speed problem. They're completely missing the creativity problem.</p>
            <p>A storyboard tool that prioritises speed over space, templates over thinking, polish over process — it's not helping creatives. It's replacing them with a slightly faster version of busy work. And the creative professionals who use it? They end up wondering why they feel less creative despite having more "productive" tools.</p>
            <p>Here's what needs to happen: storyboarding tools need to flip. Stop trying to get creatives out of the process faster. Start designing tools that get creatives deeper into the process. Tools that protect the space where ideas actually form. Tools that make collaboration mean something again. Tools that aren't trying to finish your thoughts — they're trying to help you think better.</p>
            <p className="text-accent-orange font-semibold text-lg">That's the gap nobody's filling. Until now.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: TRANSITION */}
      <section className="py-24 px-4 bg-primary-dark flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h2 className="text-h2 text-accent-orange">But here's the thing: there's a better way to think about this. And we've started mapping it out.</h2>
        </div>
      </section>

      {/* SECTION 6: THE VISION */}
      <section className="min-h-screen w-full bg-primary-light text-primary-dark py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 mb-12">IMAGINE THIS INSTEAD</h2>
          <div className="space-y-6 text-body">
            <p>What if your storyboarding tool didn't try to do your job for you? What if it actually supported your job?</p>
            <p>Imagine a tool that understands the creative process instead of trying to shortcut it. One that gives you space to think messy, collaborate deeply, and refine purposefully. A tool that makes those "wasted" minutes in your process actually valuable. Where sketching isn't a chore — it's the whole point. Where collaboration means actually working through ideas together, not just dumping files and hoping someone reads the comments.</p>
            <p>What if speed wasn't the metric? What if the metric was: did this help us think better? Did this make the creative work stronger?</p>
            <p>This isn't about better templates or smarter AI. It's about fundamentally rethinking what a storyboard tool is supposed to do. It's supposed to be an extension of your creative mind, not a replacement for it. A partner in the process, not a shortcut around it. Something that makes you more creative, not just faster at feeling creative.</p>
            <p className="text-accent-orange font-semibold text-lg">That's the shift. And it changes everything.</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: FRAMEWORK */}
      <section className="min-h-screen w-full bg-primary-dark py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 mb-6">THE FRAMEWORK</h2>
          <div className="mb-12 text-body opacity-90">
            <p>We've started building something on five core principles. These aren't features. They're philosophical commitments about how a tool should actually serve creative work. Here's what we're thinking:</p>
          </div>
          <div className="space-y-10">
            <div>
              <h3 className="text-h4 text-accent-orange mb-4">1. Protect the Sketch</h3>
              <p className="text-body opacity-90">Sketching is where ideas are born. Not perfectly rendered, not polished, not ready — just real. Our framework keeps that space sacred. You can rough-sketch ideas without your tool judging them, optimising them, or trying to finish them. The sketch stays rough until you decide it's ready to evolve. The tool gets out of the way and lets your brain work.</p>
            </div>
            <div>
              <h3 className="text-h4 text-accent-orange mb-4">2. Deepen Collaboration</h3>
              <p className="text-body opacity-90">Real collaboration isn't about everyone having access to the same file. It's about everyone having access to the same thinking process. Our framework builds in space for actual dialogue about creative decisions. Feedback that's tied to intention. Discussion that shapes the work before it becomes fixed. It's slow. It's deliberate. It's how great creative work actually gets made.</p>
            </div>
            <div>
              <h3 className="text-h4 text-accent-orange mb-4">3. Rhythm Over Speed</h3>
              <p className="text-body opacity-90">Good creative work has a rhythm. Sketching. Thinking. Discussing. Refining. Sketching again. Most tools try to collapse this into a single fast process. Our framework respects the natural rhythm of creative work. Some moments need to be fast. Some need to be slow. The tool adapts to the creative process, not the other way around.</p>
            </div>
            <div>
              <h3 className="text-h4 text-accent-orange mb-4">4. Intention Over Automation</h3>
              <p className="text-body opacity-90">AI is brilliant. Automation is powerful. But they should serve your creative intention, not replace it. Our framework treats automation as a tool you control, not something that controls your choices. You decide what gets assisted. You decide what stays fully in your hands. The AI is there to handle the genuinely tedious bits — not to make decisions about your creative work.</p>
            </div>
            <div>
              <h3 className="text-h4 text-accent-orange mb-4">5. Simplicity as a Feature</h3>
              <p className="text-body opacity-90">Modern tools are bloated. Everything crammed in. Our framework is built on the opposite belief: less is more. A focused set of capabilities, beautifully executed, that let you focus on actual creative work instead of fighting software. Simple enough that you don't need a tutorial. Powerful enough that you never outgrow it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CTA */}
      <section className="min-h-screen w-full bg-primary-light text-primary-dark py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 mb-12">LET'S BUILD THIS TOGETHER</h2>
          <div className="space-y-6 text-body mb-12">
            <p>Here's the honest bit: this is early stage. We've got the framework sketched out. We've got the philosophy locked in. What we don't have yet is your voice in the room.</p>
            <p>Because here's what we know — any tool worth building for creatives has to be built with creatives. Not for you. With you. Your frustrations. Your workflows. Your non-negotiables. The specific ways you actually work, not the ways tools think you should work.</p>
            <p>We're looking for creative professionals who are tired of the bullshit. Who've felt that slow suffocation of your creative process inside current tools. Who want to be part of building something that actually respects how creativity works.</p>
            <p>Your feedback shapes what comes next. Your input decides priorities. Your voice decides whether this becomes a real alternative or just another pretty concept.</p>
          </div>
          <div className="bg-primary-dark text-primary-light p-8 rounded-lg">
            <p className="text-body-lg font-semibold mb-4">Tell us what you think. Tell us what you need. Tell us how storyboarding has let you down.</p>
            <p className="text-body opacity-90">We're listening. And we're building this thing for people like you.</p>
          </div>
          <div className="mt-12 p-8 border-2 border-primary-dark rounded-lg text-center bg-neutral-50">
            <p className="text-body-lg text-primary-dark opacity-70">📧 Feedback form coming next</p>
          </div>
        </div>
      </section>
    </main>
  )
}
