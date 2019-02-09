import Axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import * as env from 'dotenv';
import { GrabrResponse, GrabrObject } from './grabr-interface';



env.config();

async function makeRequest() {

  const filterFromIdEql = 20813;
  const filterToIdEql = 1441;
  const limit = 100;

  const headers = {
    "accept": `application / json; version=3`,
    "Authorization": process.env.AUTH_TOKEN,
    "grabr-device": process.env.DEVICE,
    "Host": `api.grabr.io`,
  };

  const axiosInstance: AxiosInstance = Axios.create({
    headers
  });

  const response: AxiosResponse = await axiosInstance.get(`https://api.grabr.io/grabs?filter%5Bfrom.id%5D%5Beql%5D=${filterFromIdEql}&filter%5Bto.id%5D%5Beql%5D=${filterToIdEql}&limit=${limit}&include=consumer.avatar%2Cto%2Cfrom%2Citem.images%2Coffers.itinerary.from%2Coffers.itinerary.to%2Coffers.itinerary.user.avatar%2Coffers.itinerary.organization.avatar%2Cinvoice&sort=-updated_at%2C-id`);

  const grabrs: GrabrObject[] = (<GrabrResponse>response.data).data;
}

makeRequest();