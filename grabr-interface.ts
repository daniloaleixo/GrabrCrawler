export interface GrabrResponse {
  "data": GrabrObject[],
  "meta": {
    "totalCount": number;
  }
}

export interface GrabrObject {
  "id": string;
  "attributes": {
    "reward": {
      "amount": number;
      "currency": string;
    },
    "title": string;
    "hasMyOffer": boolean;
    "offersBid": Array<any>;
  },
  "links": {
    "self": string;
  }
}