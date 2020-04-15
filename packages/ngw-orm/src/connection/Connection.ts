import NgwConnector from '@nextgis/ngw-connector';
import { objectAssign } from '@nextgis/utils';
import { ConnectionOptions } from './ConnectionOptions';

/**
 * Connection is a single NGW connection.
 * You can have multiple connections to multiple NGW in your application.
 */
export class Connection {
  static connections: Connection[] = [];

  /**
   * Connection url.
   */
  readonly baseUrl: string;

  /**
   * Connection options.
   */
  readonly options: ConnectionOptions;

  /**
   * Indicates if connection is initialized or not.
   */
  readonly isConnected: boolean;

  /**
   * NGW driver used by this connection.
   */
  readonly driver: NgwConnector;

  constructor(options: ConnectionOptions) {
    this.baseUrl = options.baseUrl || '';
    this.options = options;
    this.driver = new NgwConnector(this.options);
    this.isConnected = false;
    Connection.connections.push(this);
  }

  static create(options: ConnectionOptions) {
    const exist = Connection.connections.find((connection) => {
      const eqUrl = connection.baseUrl === options.baseUrl;
      if (eqUrl) {
        if (options.auth?.login) {
          return connection.options.auth?.login === options.auth.login;
        }
        return true;
      }
      return false;
    });
    if (exist) {
      return exist;
    }
    return new Connection(options);
  }

  async connect(): Promise<this> {
    // connect to the database via its driver
    await this.driver.connect();

    // set connected status for the current connection
    objectAssign(this, { isConnected: true });

    return this;
  }
}
