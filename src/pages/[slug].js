import { useRouter } from "next/router";
import React, { useState } from "react";
import dateFormat from "dateformat";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Detail.module.css";
import { FaCheckCircle } from "react-icons/fa";

function Campaign({ data }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const jsonData = JSON.stringify({
    email,
    campaign: data.id,
  });
  console.log(`data`, jsonData);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      body: jsonData,
      headers: {
        "Content-Type": "application/json",
      },
    };

    setSubmitting(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscribers/`, options)
      .then((res) => res.json())
      .then((response) => {
        console.log(`response`, response);
        setSubmitted(true);
      })
      .catch((error) => console.log(`error`, error))
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description}></meta>
      </Head>
      <div className={styles.wrapper}>
        <div className={styles.main}></div>
        <div className={styles.content}>
          <Image
            src={`${process.env.CLOUDFOUNDRY_URL}` + "/" + data.logo}
            height={120}
            width={120}
            alt="Campaign Banner"
            className={styles.img}
          />
          <div className={styles.grid}>
            <div className={styles.left}>
              <h1 className={styles.title}>{data.title}</h1>
              <p className={styles.description}>{data.description}</p>
            </div>
            <div className={styles.right}>
              {!submitted ? (
                <div className={styles.rightContents}>
                  <form onSubmit={handleOnSubmit}>
                    <div className={styles.formGroup}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter an email address"
                        className={styles.input}
                        required
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                    <div className={styles.submit}>
                      <input
                        type="submit"
                        value={submitting ? "PLEASE WAIT" : "SUBSCRIBE"}
                        disabled={submitted}
                        className={styles.button}
                      />
                      <p className={styles.privacy}>
                        We respect your privacy, Unsubcribe anytime!
                      </p>
                    </div>
                  </form>
                </div>
              ) : (
                <div className={styles.thankYou}>
                  <div className={styles.icon}>
                    <FaCheckCircle size={17} color="green" />
                  </div>
                  <div className={styles.thankYouMessage}>
                    Thank you for your subscription
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <Link href="/" className={styles.footer}>
          <a>Go back to the list</a>
        </Link>
      </footer>
    </div>
  );
}

export async function getStaticPaths() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campaigns`
  );
  const data = await response.json();
  const allSlugs = data.map((item) => item.slug);
  console.log(allSlugs);

  const paths = allSlugs.map((slug) => ({ params: { slug: slug } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campaign/${params.slug}`
  );

  const data = await response.json();
  console.log(data);

  return {
    props: { data },
  };
}

export default Campaign;
