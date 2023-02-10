![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)
## Note about the project stack ##
The backend is implemented on Nest.js, the frontend on Angular.

Many authorities note the similarity between the architectures of Nest and Angular, which manifests itself at different levels - from the implementation of dependency injection to the organization of data flows.
As you know, Angular uses RxJs both at the core and at its API. Similarly, RxJS methods are widely used in the Nest. Thus, the `handle` method of Nest interceptors returns an object of the `Observable` interface. Further, using the event emitter in Node.js allows you to build an event-driven back-end application architecture that can leverage powerful RxJS methods.
In this project, the emitter is used in the implementation of the user notification system; this avoids the injection of additional dependencies into a variety of classes responsible for actions that should be recorded in notifications; which in turn keeps the system loosely coupled. The logic of event filtering (for example, depending on event parameters and user settings), generation, storage and formatting of messages is implemented using RxJS tools.
A brief example:
```typescript
const t = this;
const notification = fromEvent(this.emitter, Notify.deleteComment);
notification
    .pipe(
        filter((note: any) => {
            return note.comment.authorId !== note.deletedBy.id; // ...some filtration logic
        }),
        map((note: any) => {
            // ...some formatting logic
        }),
    )
    .subscribe({
        next(data) {
            t.notify(data);
        },
    });
```
One of the important technical tasks in the development of a monolithic project is the proper organization of the collaboration of the front-end and back-end to maintain their consistency. By this I mean that any change in the signatures of methods called on the server side by API requests must entail a change in the data structures sent and received by the client. With the correct organization of the project code, the need to make changes should become obvious to the developer automatically, and at the same time code duplication in different parts of the project should be minimized. A possible efficient implementation of this task is offered by the tRPC library. I solve the problem more simply - I import the same type declarations and structures into the modules of the server and client parts. In particular, common [Zod](https://zod.dev/) schemas allow you to automatically maintain the same validation rules on the client and on the server.

The type system common to the entire application, if properly designed, ensures the consistency of the Api server and client requests.

The implementation of input validation is based on the basic idea of modifying access to the properties of the data model. In native JS, this can be done by introducing a setter for the parameter, which will contain all the validation logic and, if successful, write the new value of the parameter, and if it fails (optionally) throw an exception. In TS, it is natural to create such a setter within a decorator of a class property or method parameter. The tools for validating and converting request data to Nest - Pipes work according to this scheme: syntactically, pipes act as request parameter decorators. However, pipes generally do not have direct access to the request object itself, so it can be more convenient to move part of the validation to interceptors that have full access to the execution context.

## Briefly about the project. ##
A multi-user platform where members can post entities (be it texts, videos, or coding challenges), rate and discuss entities posted by other members.
Entities are pre-moderated, comments can be edited and deleted by participants with moderator rights.
