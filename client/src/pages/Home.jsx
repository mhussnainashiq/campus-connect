import { ArrowRight, BookOpen, CalendarDays, Users } from "lucide-react";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">
            <span className="eyebrow-dot"></span>
            Your campus. Your community.
          </span>

          <h1>
            Connect, learn, and grow
            <span> together.</span>
          </h1>

          <p>
            Campus Connect helps students discover people, study groups,
            events, and communities that make campus life more connected.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary">
              Explore Campus
              <ArrowRight size={18} />
            </button>

            <button className="btn btn-secondary">
              Create an Account
            </button>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-header">
            <div>
              <span className="card-label">Campus activity</span>
              <h3>What's happening?</h3>
            </div>

            <div className="activity-indicator">
              <span></span>
              Live
            </div>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <Users size={20} />
              </div>

              <div>
                <strong>Student connections</strong>
                <p>Meet students from your department.</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <BookOpen size={20} />
              </div>

              <div>
                <strong>Study groups</strong>
                <p>Find people learning the same subjects.</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <CalendarDays size={20} />
              </div>

              <div>
                <strong>Campus events</strong>
                <p>Discover workshops, clubs, and activities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="section-heading">
          <span className="section-label">Everything in one place</span>

          <h2>
            Built around your
            <span> campus life.</span>
          </h2>

          <p>
            Discover the people, communities, and opportunities that matter
            to you.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">
              <Users size={22} />
            </div>

            <h3>Meet students</h3>

            <p>
              Discover classmates and students with similar interests,
              skills, and academic goals.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <BookOpen size={22} />
            </div>

            <h3>Study together</h3>

            <p>
              Join study groups, share resources, and collaborate with
              students from your courses.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <CalendarDays size={22} />
            </div>

            <h3>Explore events</h3>

            <p>
              Find hackathons, seminars, workshops, competitions, clubs,
              and other campus activities.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;