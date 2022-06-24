/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/pins": {
    /** List all the pin objects, matching optional filters; when no filter is provided, only successful pins are returned */
    get: {
      parameters: {
        query: {
          /** Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts */
          cid?: components["parameters"]["cid"];
          /** Return pin objects with specified name (by default a case-sensitive, exact match) */
          name?: components["parameters"]["name"];
          /** Customize the text matching strategy applied when the name filter is present; exact (the default) is a case-sensitive exact match, partial matches anywhere in the name, iexact and ipartial are case-insensitive versions of the exact and partial strategies */
          match?: components["parameters"]["match"];
          /** Return pin objects for pins with the specified status */
          status?: components["parameters"]["status"];
          /** Return results created (queued) before provided timestamp */
          before?: components["parameters"]["before"];
          /** Return results created (queued) after provided timestamp */
          after?: components["parameters"]["after"];
          /** Max records to return */
          limit?: components["parameters"]["limit"];
          /** Return pin objects that match specified metadata keys passed as a string representation of a JSON object; when implementing a client library, make sure the parameter is URL-encoded to ensure safe transport */
          meta?: components["parameters"]["meta"];
        };
      };
      responses: {
        /** Successful response (PinResults object) */
        200: {
          content: {
            "application/json": components["schemas"]["PinResults"];
          };
        };
        400: components["responses"]["BadRequest"];
        401: components["responses"]["Unauthorized"];
        404: components["responses"]["NotFound"];
        409: components["responses"]["InsufficientFunds"];
        "4XX": components["responses"]["CustomServiceError"];
        "5XX": components["responses"]["InternalServerError"];
      };
    };
    /** Add a new pin object for the current access token */
    post: {
      responses: {
        /** Successful response (PinStatus object) */
        202: {
          content: {
            "application/json": components["schemas"]["PinStatus"];
          };
        };
        400: components["responses"]["BadRequest"];
        401: components["responses"]["Unauthorized"];
        404: components["responses"]["NotFound"];
        409: components["responses"]["InsufficientFunds"];
        "4XX": components["responses"]["CustomServiceError"];
        "5XX": components["responses"]["InternalServerError"];
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["Pin"];
        };
      };
    };
  };
  "/pins/{requestid}": {
    /** Get a pin object and its status */
    get: {
      parameters: {
        path: {
          requestid: string;
        };
      };
      responses: {
        /** Successful response (PinStatus object) */
        200: {
          content: {
            "application/json": components["schemas"]["PinStatus"];
          };
        };
        400: components["responses"]["BadRequest"];
        401: components["responses"]["Unauthorized"];
        404: components["responses"]["NotFound"];
        409: components["responses"]["InsufficientFunds"];
        "4XX": components["responses"]["CustomServiceError"];
        "5XX": components["responses"]["InternalServerError"];
      };
    };
    /** Replace an existing pin object (shortcut for executing remove and add operations in one step to avoid unnecessary garbage collection of blocks present in both recursive pins) */
    post: {
      parameters: {
        path: {
          requestid: string;
        };
      };
      responses: {
        /** Successful response (PinStatus object) */
        202: {
          content: {
            "application/json": components["schemas"]["PinStatus"];
          };
        };
        400: components["responses"]["BadRequest"];
        401: components["responses"]["Unauthorized"];
        404: components["responses"]["NotFound"];
        409: components["responses"]["InsufficientFunds"];
        "4XX": components["responses"]["CustomServiceError"];
        "5XX": components["responses"]["InternalServerError"];
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["Pin"];
        };
      };
    };
    /** Remove a pin object */
    delete: {
      parameters: {
        path: {
          requestid: string;
        };
      };
      responses: {
        /** Successful response (no body, pin removed) */
        202: unknown;
        400: components["responses"]["BadRequest"];
        401: components["responses"]["Unauthorized"];
        404: components["responses"]["NotFound"];
        409: components["responses"]["InsufficientFunds"];
        "4XX": components["responses"]["CustomServiceError"];
        "5XX": components["responses"]["InternalServerError"];
      };
    };
    parameters: {
      path: {
        requestid: string;
      };
    };
  };
}

export interface components {
  schemas: {
    /** @description Response used for listing pin objects matching request */
    PinResults: {
      /**
       * Format: int32
       * @description The total number of pin objects that exist for passed query filters
       * @example 1
       */
      count: number;
      /** @description An array of PinStatus results */
      results: components["schemas"]["PinStatus"][];
    };
    /** @description Pin object with status */
    PinStatus: {
      /**
       * @description Globally unique identifier of the pin request; can be used to check the status of ongoing pinning, or pin removal
       * @example UniqueIdOfPinRequest
       */
      requestid: string;
      status: components["schemas"]["Status"];
      /**
       * Format: date-time
       * @description Immutable timestamp indicating when a pin request entered a pinning service; can be used for filtering results and pagination
       * @example 2020-07-27T17:32:28Z
       */
      created: string;
      pin: components["schemas"]["Pin"];
      delegates: components["schemas"]["Delegates"];
      info?: components["schemas"]["StatusInfo"];
    };
    /** @description Pin object */
    Pin: {
      /**
       * @description Content Identifier (CID) to be pinned recursively
       * @example QmCIDToBePinned
       */
      cid: string;
      /**
       * @description Optional name for pinned data; can be used for lookups later
       * @example PreciousData.pdf
       */
      name?: string;
      origins?: components["schemas"]["Origins"];
      meta?: components["schemas"]["PinMeta"];
    };
    /**
     * @description Status a pin object can have at a pinning service
     * @enum {string}
     */
    Status: "queued" | "pinning" | "pinned" | "failed";
    /**
     * @description List of multiaddrs designated by pinning service that will receive the pin data; see Provider Hints in the docs
     * @example /ip4/203.0.113.1/tcp/4001/p2p/QmServicePeerId
     */
    Delegates: string[];
    /**
     * @description Optional list of multiaddrs known to provide the data; see Provider Hints in the docs
     * @example /ip4/203.0.113.142/tcp/4001/p2p/QmSourcePeerId,/ip4/203.0.113.114/udp/4001/quic/p2p/QmSourcePeerId
     */
    Origins: string[];
    /**
     * @description Optional metadata for pin object
     * @example [object Object]
     */
    PinMeta: { [key: string]: string };
    /**
     * @description Optional info for PinStatus response
     * @example [object Object]
     */
    StatusInfo: { [key: string]: string };
    /**
     * @description Alternative text matching strategy
     * @default exact
     * @enum {string}
     */
    TextMatchingStrategy: "exact" | "iexact" | "partial" | "ipartial";
    /** @description Response for a failed request */
    Failure: {
      error: {
        /**
         * @description Mandatory string identifying the type of error
         * @example ERROR_CODE_FOR_MACHINES
         */
        reason: string;
        /**
         * @description Optional, longer description of the error; may include UUID of transaction for support, links to documentation etc
         * @example Optional explanation for humans with more details
         */
        details?: string;
      };
    };
  };
  responses: {
    /** Error response (Bad request) */
    BadRequest: {
      content: {
        "application/json": components["schemas"]["Failure"];
      };
    };
    /** Error response (Unauthorized; access token is missing or invalid) */
    Unauthorized: {
      content: {
        "application/json": components["schemas"]["Failure"];
      };
    };
    /** Error response (The specified resource was not found) */
    NotFound: {
      content: {
        "application/json": components["schemas"]["Failure"];
      };
    };
    /** Error response (Insufficient funds) */
    InsufficientFunds: {
      content: {
        "application/json": components["schemas"]["Failure"];
      };
    };
    /** Error response (Custom service error) */
    CustomServiceError: {
      content: {
        "application/json": components["schemas"]["Failure"];
      };
    };
    /** Error response (Unexpected internal server error) */
    InternalServerError: {
      content: {
        "application/json": components["schemas"]["Failure"];
      };
    };
  };
  parameters: {
    /**
     * @description Return results created (queued) before provided timestamp
     * @example 2020-07-27T17:32:28Z
     */
    before: string;
    /**
     * @description Return results created (queued) after provided timestamp
     * @example 2020-07-27T17:32:28Z
     */
    after: string;
    /** @description Max records to return */
    limit: number;
    /**
     * @description Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts
     * @example Qm1,Qm2,bafy3
     */
    cid: string[];
    /**
     * @description Return pin objects with specified name (by default a case-sensitive, exact match)
     * @example PreciousData.pdf
     */
    name: string;
    /**
     * @description Customize the text matching strategy applied when the name filter is present; exact (the default) is a case-sensitive exact match, partial matches anywhere in the name, iexact and ipartial are case-insensitive versions of the exact and partial strategies
     * @example exact
     */
    match: components["schemas"]["TextMatchingStrategy"];
    /**
     * @description Return pin objects for pins with the specified status
     * @example queued,pinning
     */
    status: components["schemas"]["Status"][];
    /** @description Return pin objects that match specified metadata keys passed as a string representation of a JSON object; when implementing a client library, make sure the parameter is URL-encoded to ensure safe transport */
    meta: unknown;
  };
}

export interface operations {}

export interface external {}
