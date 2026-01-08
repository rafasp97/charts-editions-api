import { BadRequestException } from "@nestjs/common";
import { join } from "path";
import { ImageDto } from "src/dto/image.dto";
import { readFileSync } from 'fs';
import { Artist } from "src/interfaces/Artist.interface";

export class Template {

  static generateHtml(image: Express.Multer.File, dto: ImageDto) {
    return `<!DOCTYPE html>
        <html>

        <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet">
        <style>
            * {
            font-family: "Montserrat", sans-serif;
            font-optical-sizing: auto;
            font-weight: normal;
            font-style: normal;
            }

            body>div>div {
            display: flex;
            flex-direction: row;
            gap: 2em;
            }

            .canvas {
            width: 793px;
            max-height: 992px;
            padding: 0.5em;
            position: relative;
            overflow: hidden;
            background: linear-gradient(to bottom, #${dto.color}, ${this.darkenHexColor(dto.color)});
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            }

            table {
            width: 100%;
            border-collapse: collapse;
            /* IMPORTANTE: não use 'collapse' */
            border-spacing: 1em 0.4em;
            margin-left: 2em;
            }

            th,
            td {
            border-bottom: solid #0b0b12 4px;
            padding: 6px;
            text-align: left;
            font-size: 1.2em;
            }

            .header {
            display: flex;
            align-items: center;
            padding: 0em 0.5em;
            position: relative;
            bottom: 1em;
            }

            .devInfo {
            background-color: #0b0b12;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 2em;
            left: 0em;
            top: 0em;
            padding: 0.3em;
            position: absolute;
            }

            .logo {
            padding: 0.6em 0.5em;
            margin-top: 0.4em;
            background-color: #0b0b12;
            position: relative;
            border-radius: 10px;
            top: 2em;
            }

            .footer {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1em;
            height: 1em;
            }

            .main {
            margin: 0.5em;
            margin-bottom: 1em;
            background-color: rgba(255, 255, 255, 0.329);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 1.5em 0.5em;
            border-radius: 10px;
            }

            .rank {
            display: flex;
            width: 80em;
            }

            .header>span {
            margin-right: 2.7em;
            }

            .winContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 52em;
            text-align: center;
            }

            .winContainer>span,
            .header>span {
            margin-top: 0.5em;
            font-size: 2em;
            letter-spacing: 0.5px;
            font-weight: bold;
            }

            .winContainer>img {
            width: 250px;
            }

            .imageContainer{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16em;
            height: 20em;
            text-align: center;
            overflow: hidden;
            border-radius: 5px;
            }

            .imageContainer img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            }

            .crownContainer {
            display: flex;
            flex-direction: column;
            gap: 0.47em;
            position: relative;
            left: 1em;
            }

            .rankContainer {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            position: relative;
            left: 1em;
            top: 0.2em;
            }

            .icon {
            width: 7em;
            }

            .icon-github {
            width: 2em;
            height: 2em;
            }

            .title {
            padding-top: 4em;
            margin-left: 1em;
            margin-top: 1.5em;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;
            }

            .title>span {
            text-align: right;
            font-size: 1.2em;
            }

            .iconTitle {
            width: 30em;
            }

            .iconSubtitle {
            width: 13em;
            margin-top: 1em;
            }

            .status-container {
            display: flex;
            justify-content: center;
            width: 2.5em;
            height: 2em;
            padding-top: 0.1em;
            }

            .status-img {
            width: 2.5rem;
            }

            .status-img-new {
            width: 2.3rem;
            height: 2rem;
            margin-right: 1em;
            }

            .status-number {
            position: relative;
            right: 0.5rem;
            font-weight: bold;
            font-size: 1.4em;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            width: 1.3em;
            color: #0b0b12;
            height: 1.3em;
            display: flex;
            align-items: center;
            justify-content: center;
            }

            .metrics {
            margin: 0em 0.5em 0.5em 0.5em;
            }

            .topOthers {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            gap: 16px;
            place-items: center;
            margin-bottom: 2em;
            width: 37em;
            }

            .topOverall {
            width: 20em;
            height: 18em;
            background-color: rgba(255, 255, 255, 0.329);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 0.5em;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            }

            .trophy {
            width: 10em;
            }

            .userSpan {
            padding: 0.5em 1em;
            color: white;
            background-color: #0b0b12;
            border-radius: 5px;
            }

            .topMetrics {
            display: flex;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.329);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 0.5em 1em;
            box-sizing: border-box;
            border-radius: 10px;
            width: 100%;
            gap: 1em;
            height: 9em;
            }

            .topMetrics>div {
            display: flex;
            flex-direction: column;
            justify-content: start;
            position: relative;
            }

            .topMetrics p,
            .topOverallP {
            font-weight: bold;
            font-size: 1.2em;
            margin: 0.5em 0em 0em 0em;
            }

            .topMetrics span {
            display: block;
            padding: 0.3em;
            }

            .topMetrics>img {
            width: 5em;
            height: 5em;
            }

            .crown {
            width: 2.2em;
            }

            .name {
            width: 100%;
            }

            .other {
            width: 2em;
            text-align: center;
            }

            .infoBox {
              background-color: #bfdbfe;
              border: 1px solid #93c5fd;
              border-radius: 10px; 
              padding: 1em; 
              text-align: center; 
              margin: 0em 0.5em 0.5em 0.5em;
            }

            .bold-email {
              font-weight: 700; /* força o negrito */
            }
        </style>
        </head>

        <body>
        <div class="canvas">
            <div class="devInfo">
            <p>charts-edition.netlify.app</p>
            </div>
            <div class="header">
            <div class="logo">
                <img src=${this.getImage('public/images/logo.png')} class="icon" alt="Descrição da imagem" />
            </div>
            <div class="title">
                <img src=${this.getImage('public/images/titleArtists.png')} class="iconTitle" alt="Descrição da imagem" />
                <span>${this.getPeriod(dto.charts.period)}</span>
            </div>
            </div>
            <div class="main">
            <div class="rank">
                <div class="rankContainer">
                <img src=${this.getImage('public/images/rank1.png')} class="crown" alt="rank1" />
                <img src=${this.getImage('public/images/rank2.png')} class="crown" alt="rank2" />
                <img src=${this.getImage('public/images/rank3.png')} class="crown" alt="rank3" />
                </div>
                <table>
                <tbody>
                    ${this.applyRank(dto.charts.rank)}
                </tbody>
                </table>
                <div class="crownContainer">
                ${this.applyIndex(dto.charts.rank)}
                </div>
            </div>
            <div class="winContainer">
                <div class="imageContainer">
                    <img src="${this.getImageDataForm(image)}" class="icon" alt="Descrição da imagem" />
                </div>
                <span>${dto.charts.rank[0].name.toUpperCase()}</span>
            </div>
            </div>
            ${dto.charts.metrics ? `
            <div class="metrics">
              <div class="topOverall">
                  <p class="topOverallP">USUÁRIO DESTAQUE</p>
                  <img src=${this.getImage('public/images/trophy.png')} class="trophy" />
                  <span class="userSpan">${dto.charts.metrics.overallTopListener.user}</span>
                  <p>${dto.charts.metrics.overallTopListener.plays} plays - ${dto.charts.metrics.overallTopListener.percentage}%</p>
              </div>
              <div class="topOthers">
                  <div class="topMetrics">
                  <img src=${this.getImage('public/images/icons/tendencies.png')}/>
                  <div>
                      <p>CRIADORES DE TENDÊNCIAS</p>
                      <span>${dto.charts.metrics.top1Listener} - ${dto.charts.rank[0].name}</span>
                      <span>${dto.charts.metrics.top2Listener} - ${dto.charts.rank[1].name}</span>
                      <span>${dto.charts.metrics.top3Listener} - ${dto.charts.rank[2].name}</span>
                  </div>
                  </div>
                  <div class="topMetrics">
                  <img src=${this.getImage('public/images/icons/explorers.png')}/>
                  <div>
                      <p>EXPLORADORES SONOROS</p>
                      ${this.getNewArtistsTopListeners(dto.charts.metrics.newArtistsTopListeners)}
                  </div>
                  </div>
              </div>
            </div>     
            `: `
            <div class="infoBox" ref="container">
              <span>
                Para incluir métricas avançadas, como dados de usuários, histórico de colocações dos artistas e a criação de grupos personalizados, envie um email para: 
                <strong class="bold-email">rafaelsprata@outlook.com</strong>
              </span>
            </div>
            `}
        </div>
        </body>

        </html>`
  }

  static getImage(path: string) {
    const imgPath = join(process.cwd(), path);
    const imgBase64 = readFileSync(imgPath).toString('base64');
    return `"data:image/png;base64,${imgBase64}"`;
  }

  static getImageDataForm(image: Express.Multer.File) {
    const imgBase64 = image.buffer.toString('base64');

    return `data:${image.mimetype};base64,${imgBase64}`;
  }

  static getPeriod(period: any) {
    if(!period) return '';
    else return `${period.start} - ${period.end}`
  }

  static applyRank(rank: any) {
    return rank
      .map(
        (artist: any, index: number) => `
            <tr>
            <td class="other">${index + 1}</td>
            <td class="name">${artist.name}</td>
            <td class="other">${artist.playcount}</td>
            </tr>
        `
      )
      .join('');
  }

  static applyIndex(rank: any[]) {
    if (rank[0].index == undefined) return '';
    return rank
      .map(
        (artist: any) => {
          if (!artist.new && artist.index != 0) {
            return `
              <div class="status-container">
                <span class="status-number">${artist.index > 0 ? '+' + artist.index : artist.index}</span>
              </div>`
          } else if (artist.index == 0) {
            return `
              <div class="status-container">
                <span class="status-number"></span>
              </div>`
          } else {
            return `
            <div class="status-container">
              <img src=${this.getImage('public/images/icons/new.png')} alt="status" class="status-img-new" />
            </div>`
          }
        }
      )
      .join('');
  }

  static getNewArtistsTopListeners(newArtistsTopListeners: any[]) {
    return newArtistsTopListeners
      .slice(0, 3)
      .map(
        (topListener: any) => `<span>${topListener.user} - ${topListener.artist}</span>`
      )
      .join('');
  }

static darkenHexColor(hex: string, amount: number = 100): string {

  hex = hex.replace(/^#/, '');

  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = b.toString(16).padStart(2, '0');

  return `#${rr}${gg}${bb}`;
}



}
