
let apiDoc = [

{
  "openapi": "3.0.0",
  "info": {
    "title": "Web Intefaces API",
    "version": "1.0",
    "contact": {
      "name": "Joni Arstio",
      "email": "t9arjo00@students.oamk.fi"
    }
  },
  "servers": [
    {
      "url": "https://web-interface-api.herokuapp.com/"
    }
  ],
  "paths": {
    "/users": {
      "post": {
        "summary": "Create user",
        "operationId": "post-users",
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "userId": {
                      "type": "integer"
                    }
                  }
                },
                "examples": {
                  "example-1": {
                    "value": {
                      "userId": 56
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorReason"
                },
                "examples": {
                  "example-1": {
                    "value": {
                      "reason": "password missing"
                    }
                  }
                }
              }
            }
          }
        },
        "description": "Create new user",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "username": {
                    "type": "string"
                  },
                  "password": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "firstName": {
                    "type": "string"
                  },
                  "lastName": {
                    "type": "string"
                  },
                  "phoneNumber": {
                    "type": "string"
                  },
                  "dateOfBirth": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "users"
        ]
      }
    },
    "/users/{userId}": {
      "parameters": [
        {
          "schema": {
            "type": "string"
          },
          "name": "userId",
          "in": "path",
          "required": true,
          "description": "Id of the user"
        }
      ],
      "get": {
        "summary": "Get user information",
        "tags": [
          "users"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                },
                "examples": {
                  "example-1": {
                    "value": {
                      "id": 854,
                      "username": "Janet",
                      "password": "passwordexample"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorReason"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorReason"
                }
              }
            }
          }
        },
        "operationId": "get-users-userId",
        "security": [
          {
            "JWT": []
          }
        ],
        "description": "Get user information"
      },
      "put": {
        "summary": "Modify user info",
        "operationId": "put-users-userId",
        "responses": {
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorReason"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorReason"
                }
              }
            }
          }
        },
        "description": "Modify user information",
        "security": [
          {
            "JWT": []
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/User"
              },
              "examples": {
                "example-1": {
                  "value": {
                    "username": "mike",
                    "password": "passwordexample"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "users"
        ]
      },
      "delete": {
        "summary": "Delete user",
        "operationId": "delete-users-userId",
        "responses": {
          "200": {
            "description": "OK"
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorReason"
                }
              }
            }
          }
        },
        "security": [
          {
            "JWT": []
          }
        ],
        "tags": [
          "users"
        ]
      }
    },
    "/users/login": {
      "get": {
        "summary": "Login to the system",
        "tags": [
          "users"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "jwt": {
                      "type": "string"
                    }
                  }
                },
                "examples": {
                  "example-1": {
                    "value": {
                      "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozfSwiaWF0IjoxNjEzMTM1MTUwLCJleHAiOjE2MTMxMzUyMTB9.3Q1IKmUdVIt-xtUbIr94M2xL-SbH5-w5DeKBAAA87TY"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorReason"
                }
              }
            }
          }
        },
        "operationId": "get-login",
        "security": [
          {
            "HTTP Basic": []
          }
        ],
        "description": "Login to the system",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/User"
              },
              "examples": {
                "example-1": {
                  "value": {
                    "username": "joe",
                    "password": "passwordexample"
                  }
                }
              }
            }
          }
        }
      },
      "parameters": []
    },
    "/products": {
      "get": {
        "summary": "Get all products of a user",
        "tags": [
          "Product"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "products": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Product"
                      }
                    }
                  }
                },
                "examples": {
                  "example-1": {
                    "value": {
                      "products": [
                        {
                          "id": 5346,
                          "title": "Test product",
                          "description": "This is description of the product",
                          "category": "Test category",
                          "location": "Oulu, Finland",
                          "images": "https://images.com",
                          "price": 23.5,
                          "deliveryType": "Posti",
                          "sellerName": "Matti Myyjä",
                          "sellerPhone": "+358401234567"
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        },
        "operationId": "get-products",
        "security": [
          {
            "JWT": []
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {}
              }
            }
          }
        },
        "description": "Get all products"
      },
      "post": {
        "summary": "Create a new product",
        "operationId": "post-products",
        "responses": {
          "201": {
            "description": "Created"
          }
        },
        "description": "Create a new product",
        "security": [
          {
            "JWT": []
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Product"
              },
              "examples": {
                "example-1": {
                  "value": {
                    "id": 2356,
                    "title": "Test product",
                    "description": "This is description of the product",
                    "category": "Test category",
                    "location": "Oulu, Finland",
                    "images": "https://images.com",
                    "price": 23.5,
                    "deliveryType": "Posti",
                    "sellerName": "Matti Myyjä",
                    "sellerPhone": "+358401234567"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "Product"
        ]
      },
      "parameters": []
    },
    "/products/{id}": {
      "parameters": [
        {
          "schema": {
            "type": "string"
          },
          "name": "id",
          "in": "path",
          "required": true
        }
      ],
      "get": {
        "summary": "Get a single product",
        "tags": [
          "Product"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Product"
                }
              }
            }
          },
          "404": {
            "description": "Not found"
          }
        },
        "operationId": "get-products-id",
        "description": "",
        "security": [
          {
            "JWT": []
          }
        ]
      },
      "put": {
        "summary": "Modify a product",
        "operationId": "put-products-id",
        "responses": {
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorReason"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorReason"
                }
              }
            }
          }
        },
        "security": [
          {
            "JWT": []
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Product"
              }
            }
          }
        },
        "tags": [
          "Product"
        ]
      }
    },
    "/products/all": {
      "get": {
        "summary": "Get all products",
        "tags": [
          "Product"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Product"
                }
              }
            }
          },
          "404": {
            "description": "Not found"
          }
        },
        "operationId": "get-products-all",
        "description": "",
        "security": [
          {
            "JWT": []
          }
        ]
      }
    }
  },
  "components": {
    "securitySchemes": {
      "JWT": {
        "type": "http",
        "scheme": "bearer",
        "description": ""
      },
      "HTTP Basic": {
        "type": "http",
        "scheme": "basic"
      }
    },
    "schemas": {
      "User": {
        "title": "User",
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "username": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "phoneNumber": {
            "type": "string"
          },
          "dateOfBirth": {
            "type": "string"
          }
        },
        "required": [
          "username, password"
        ],
        "x-examples": {
          "example-1": {
            "id": 2356,
            "username": "jane",
            "password": "passwordexample"
          }
        },
        "x-tags": [
          "Schema"
        ]
      },
      "ErrorReason": {
        "title": "ErrorReason",
        "type": "object",
        "properties": {
          "reason": {
            "type": "string"
          }
        },
        "x-tags": [
          "Schema"
        ]
      },
      "Product": {
        "title": "Product",
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "description": "Id of the product"
          },
          "title": {
            "type": "string",
            "description": "Title of the product"
          },
          "description": {
            "type": "string",
            "description": "Description of the product"
          },
          "category": {
            "type": "string",
            "description": "Category of the product"
          },
          "location": {
            "type": "string",
            "description": "Location of the product"
          },
          "images": {
            "type": "string",
            "description": "Images of the product"
          },
          "price": {
            "type": "number",
            "description": "Price of the product"
          },
          "deliveryType": {
            "type": "string",
            "description": "What are delivery methods"
          },
          "sellerName": {
            "type": "string",
            "description": "Name of the seller"
          },
          "sellerPhone": {
            "type": "string",
            "description": "Phone number of the seller"
          },
          "createdDateTime": {
            "type": "string",
            "description": "Server created date time, ISO 8601",
            "format": "date-time",
            "example": "2020-04-03T10:29:02Z"
          } 
        },
        "required": [
          "id",
          "title",
          "description",
          "category", 
          "location", 
          "images", 
          "price", 
          "deliveryType", 
          "sellerName", 
          "sellerPhone"
        ],
        "x-tags": [
          "Schema"
        ]
      }
    }
  }
}]

exports.getApiDoc = function() 
{
    return apiDoc;
}