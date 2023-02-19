import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    const res = {
      name: 'szia',
      text: 'asd',
      abc: 123,
    };
    return res;
  }
}
