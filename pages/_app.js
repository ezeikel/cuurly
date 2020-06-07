import App from "next/app";
import { ApolloProvider } from "@apollo/client";
import styled from "styled-components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/pro-solid-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as Sentry from "@sentry/browser";
import GlobalStyle from "../GlobalStyle";
import withApolloClient from "../apollo/client";
import Page from "../components/Page";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: process.env.SENTRY_RELEASE,
});

library.add(fab, fas, far, fal);

const StyledToastContainer = styled(ToastContainer).attrs({
  className: "toast-container",
  toastClassName: "toast",
  bodyClassName: "body",
  progressClassName: "progress",
})`
  /* .toast-container */
  bottom: 0;
  left: 0;
  padding: 0;
  margin: 0;
  width: 100%;
  .toast {
    background-color: var(--color-black);
    margin: 0;
    cursor: auto;
  }
  button[aria-label="close"] {
    display: none;
  }
  .toast {
    background-color: var(--color-black);
  }
  .body {
    background-color: var(--color-black);
    color: var(--color-white);
    font-family: var(--default-font-family);
    margin: 0;
    display: grid;
    align-items: center;
  }
`;

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps, err } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <GlobalStyle />
        <Page>
          <Component {...pageProps} err={err} />
        </Page>
        <StyledToastContainer
          position="bottom-center"
          draggable
          hideProgressBar
          pauseOnHover
          autoClose={3000}
          draggable={false}
          closeOnClick={false}
        />
      </ApolloProvider>
    );
  }
}

export default withApolloClient(MyApp);
