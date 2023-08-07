import { NodeJSStreamEventProvider } from '@infra/providers/event/nodejs-stream';

export class NodeJSStreamEventProviderFactory {
  static instance: NodeJSStreamEventProvider;

  static getInstance(): NodeJSStreamEventProvider {
    if (this.instance) return this.instance;

    this.instance = new NodeJSStreamEventProvider();

    return this.instance;
  }
}
