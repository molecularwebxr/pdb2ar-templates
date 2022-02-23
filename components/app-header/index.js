const headerTemplate = document.createElement("template");
headerTemplate.innerHTML = /* html */ `
  <style>
  header {
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
    padding: 1rem 4rem;
    background-color: #FFFFFF;
  }

  a {
    text-decoration: none;
  }

  figure {
    margin: 0;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .column {
    display: flex;
    flex-direction: column;
  }
  
  
  @media screen and (max-width: 800px) {
    header {
      padding: 1rem 2rem;
    }
  }

  </style>
  <div id="overlay" class="overlay"></div>
  <header class="row">
    <figure>
      <a href="#">
        <molecule-icon></molecule-icon>
      </a>
    </figure>
  </header>  
  </div>

  `;

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true));
  }


}

customElements.define("app-header", AppHeader);
