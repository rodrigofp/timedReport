const template = `
            <footer class="bg-light pt-4 pb-2">
                <div class="container">
                    <div class="row text-muted">
                        <small class="col" data-hj-whitelist>
                            TimedReport!™ — v{{ tagName }}
                        </small>
                        <small class="col text-right">
                            Vinícius Hoyer
                        </small>
                    </div>
                </div>
            </footer>
`;

function request(obj) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(obj.method || 'GET', obj.url);
    if (obj.headers) {
      Object.keys(obj.headers).forEach((key) => {
        xhr.setRequestHeader(key, obj.headers[key]);
      });
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(obj.body);
  });
}

Vue.component('my-footer', {
  template,
  data() {
    return {
      tagName: '2018.5.1',
    };
  },
  mounted() {
    request({
      url: 'https://api.github.com/graphql',
      method: 'POST',
      headers: {
        Authorization: 'bearer 15d45d5940bd6195d88851801f81ac85f1c950b4',
      },
      body: JSON.stringify({
        query: `query {
                    repository(owner: "vhoyer", name: "timedReport") {
                      refs(refPrefix: "refs/tags/", first: 1, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) {
                        edges {
                          node {
                            name
                          } } } } }`,
      }),
    })
      .then((raw) => {
        const { data } = JSON.parse(raw);
        this.tagName = data.repository.refs.edges[0].node.name;
      });
  },
});
