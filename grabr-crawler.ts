import Axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import * as env from 'dotenv';
import { GrabrResponse, GrabrObject } from './grabr-interface';

import * as writeJSON from 'write-json-file';

import * as fs from 'fs';



env.config();

async function makeRequest() {

  let grabrRespone: GrabrResponse;

  if (process.env.ENV == "prod") {


    const filterFromIdEql = 50000;
    const filterToIdEql = 25000;
    const limit = 100;

    const headers = {
      "accept": `application / json; version=3`,
      "Authorization": process.env.AUTH_TOKEN,
      "grabr-key-inflection": "camel_lower",
      "grabr-locale": "pt",
      "grabr-platform": "web",
      "grabr-device": process.env.DEVICE,
      "If-None-Match": `W/"1c9ecde76625d67d9a0d11fb7d0873ce"`,
      "Host": `api.grabr.io`,
    };

    const axiosInstance: AxiosInstance = Axios.create({
      headers
    });

    const response: AxiosResponse = await axiosInstance.get(`https://api.grabr.io/grabs?filter%5Bfrom.id%5D%5Beql%5D=${filterFromIdEql}&filter%5Bto.id%5D%5Beql%5D=${filterToIdEql}&limit=${limit}&include=consumer.avatar%2Cto%2Cfrom%2Citem.images%2Coffers.itinerary.from%2Coffers.itinerary.to%2Coffers.itinerary.user.avatar%2Coffers.itinerary.organization.avatar%2Cinvoice&sort=-updated_at%2C-id`);


    grabrRespone = <GrabrResponse>response.data;
  } else {
    // In dev we will get right from the json file
    grabrRespone = JSON.parse(fs.readFileSync('./payload-example.json', 'utf8'));
  }



  const grabrs: GrabrObject[] = grabrRespone.data;

  const allNomBidGrabs: GrabrObject[] = grabrs.filter((grabr: GrabrObject) => {
    return !grabr.attributes.hasMyOffer && grabr.attributes.offersBid && grabr.attributes.offersBid.length == 0;
  });


  const mappedgarbrs = allNomBidGrabs.map(obj => {
    return {
      link: obj.links.self,
      name: obj.attributes.title,
      reward: obj.attributes.reward ? obj.attributes.reward.amount : null
    };
  });

  console.log(mappedgarbrs);


  await writeJSON.default('grabs.json', mappedgarbrs);

  console.log('Grabs written in grabs.json');

}

makeRequest();