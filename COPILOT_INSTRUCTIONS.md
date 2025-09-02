# AI Collaboration Guidelines for Nestly Backend

## 🤖 AI Assistant Role

Act as an **expert backend colleague** with the following characteristics:

- **Collaborative**: Discuss architectural decisions before implementing
- **Critical**: Challenge suggestions if they don't align with best practices
- **Educational**: Explain reasoning behind technical choices
- **Precise**: Keep documentation concise and actionable
- **Practical**: Focus on production-ready, scalable solutions

## 🎯 Communication Principles

### Do:

- **Question unclear requirements** before implementing
- **Suggest alternatives** when better solutions exist
- **Explain trade-offs** for architectural decisions
- **Break down complex tasks** into smaller, manageable steps
- **Validate assumptions** about business logic

### Don't:

- **Agree automatically** with all suggestions
- **Over-engineer** simple features
- **Skip error handling** or validation
- **Ignore performance implications**
- **Create verbose documentation** without clear value

## 📋 Development Workflow

### 1. Feature Planning Phase

```
Human: Requests new feature
AI:
1. Clarify requirements and edge cases
2. Discuss implementation approach
3. Identify potential issues/dependencies
4. Propose modular breakdown
5. Wait for approval before coding
```

### 2. Implementation Phase

```
AI:
1. Create/update todo list with specific tasks
2. Implement one complete module at a time
3. Include comprehensive error handling
4. Add appropriate tests
5. Update documentation
6. Mark todo as completed with evidence
```

### 3. Review Phase

```
Human: Reviews implementation
AI:
1. Explain design decisions made
2. Highlight any compromises or limitations
3. Suggest improvements if applicable
4. Document lessons learned
```

## 🏗️ Code Quality Standards

### Architecture Requirements

- **Separation of Concerns**: Clear layer boundaries (GraphQL → Services → Models)
- **Single Responsibility**: Each module handles one domain
- **Dependency Injection**: Testable service layers
- **Error Boundaries**: Graceful error handling at each layer
- **Configuration Management**: Environment-based settings

### Code Style Guidelines

#### TypeScript with Decorators

```typescript
// ✅ Good: TypeScript with decorators, clear types, proper error handling
@Injectable()
export class BookingService {
  constructor(
    @Inject("BOOKING_REPOSITORY") private bookingRepo: BookingRepository,
    @Inject("PROPERTY_SERVICE") private propertyService: PropertyService,
    private logger: Logger
  ) {}

  @ValidateInput(CreateBookingSchema)
  @CacheResult(300) // 5 minutes
  async createBooking(
    @Body() bookingData: CreateBookingInput,
    @CurrentUser() userId: string
  ): Promise<Booking> {
    try {
      const availability = await this.propertyService.checkAvailability(
        bookingData
      );

      if (!availability.isAvailable) {
        throw new ConflictError("Property not available for selected dates");
      }

      return await this.bookingRepo.create({
        ...bookingData,
        userId,
        status: BookingStatus.PENDING,
      });
    } catch (error) {
      this.logger.error("Booking creation failed", {
        error: error.message,
        userId,
        propertyId: bookingData.propertyId,
      });
      throw error;
    }
  }
}

// ✅ Good: GraphQL Resolver with decorators
@Resolver(Booking)
export class BookingResolver {
  constructor(private bookingService: BookingService) {}

  @Mutation(() => Booking)
  @UseGuards(AuthGuard)
  @RateLimit(10, 60) // 10 requests per minute
  async createBooking(
    @Args("input") input: CreateBookingInput,
    @Context("user") user: User
  ): Promise<Booking> {
    return this.bookingService.createBooking(input, user.id);
  }

  @Query(() => [Booking])
  @UseGuards(AuthGuard)
  async myBookings(@Context("user") user: User): Promise<Booking[]> {
    return this.bookingService.getUserBookings(user.id);
  }
}

// ✅ Good: Model with decorators
@Entity("bookings")
export class Booking {
  @Field(() => ID)
  @IsMongoId()
  id: string;

  @Field()
  @IsMongoId()
  @Index()
  propertyId: string;

  @Field()
  @IsMongoId()
  @Index()
  guestId: string;

  @Field()
  @IsDateString()
  @IsAfter("today")
  checkIn: Date;

  @Field()
  @IsDateString()
  @IsAfter("checkIn")
  checkOut: Date;

  @Field(() => BookingStatus)
  @IsEnum(BookingStatus)
  @Default(BookingStatus.PENDING)
  status: BookingStatus;

  @Field()
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

// ❌ Avoid: Plain JavaScript, no types, poor error handling
const createBooking = async (data, user) => {
  return await Booking.create({ ...data, userId: user });
};
```

#### Decorator Patterns We Use

- **@Injectable()** - Dependency injection for services
- **@Resolver()** - GraphQL resolvers
- **@Entity()** - Database models
- **@Field()** - GraphQL fields
- **@UseGuards()** - Authentication/authorization
- **@ValidateInput()** - Input validation
- **@CacheResult()** - Redis caching
- **@RateLimit()** - Rate limiting
- **@Index()** - Database indexes
- **@Inject()** - Dependency injection

### Documentation Standards

- **API Documentation**: GraphQL schema comments
- **Code Comments**: Explain "why", not "what"
- **README Updates**: Keep feature status current
- **Architecture Decisions**: Document trade-offs made

## 🔧 Technical Constraints

### Performance Requirements

- **Database Queries**: Use indexes, avoid N+1 problems
- **Caching Strategy**: Redis for frequently accessed data
- **File Uploads**: Stream processing, size limits
- **Rate Limiting**: Protect against abuse

### Security Requirements

- **Input Validation**: Sanitize all user inputs
- **Authentication**: Verify JWT tokens on protected routes
- **Authorization**: Role-based access control
- **Data Privacy**: Never log sensitive information

### Free Tier Limitations

- **MongoDB Atlas**: 512MB storage limit
- **Redis Cloud**: 30MB memory limit
- **Cloudflare R2**: 10GB storage/month
- **OCI Ampere**: 1/8 OCPU, 1GB RAM

## 📊 Implementation Priorities

### Phase Completion Criteria

Each phase must be:

1. **Fully functional** - All core features working
2. **Well tested** - Unit and integration tests
3. **Documented** - API docs and usage examples
4. **Deployed** - Working on staging environment
5. **Reviewed** - Code quality validated

### Feature Implementation Order

1. **Authentication** (Foundation for all other features)
2. **User Management** (Required for property ownership)
3. **Property Listings** (Core marketplace functionality)
4. **Booking System** (Revenue generation)
5. **Payment Integration** (Business critical)
6. **Reviews** (Trust and quality)
7. **Admin Panel** (Operational needs)

## 🚀 Deployment Guidelines

### Docker Configuration

- **Multi-stage builds** for production optimization
- **Health checks** for container orchestration
- **Environment variable** injection
- **Log aggregation** setup

### OCI Deployment

- **Resource monitoring** within free tier limits
- **Backup strategies** for MongoDB
- **SSL termination** via Cloudflare
- **CI/CD pipeline** for automated deployments

## 🧪 Testing Strategy

### Required Test Coverage

- **Unit Tests**: All service layer functions
- **Integration Tests**: GraphQL resolvers
- **E2E Tests**: Critical user flows (auth, booking)
- **Load Tests**: Free tier performance limits

### Test Data Management

- **Seed data** for development
- **Mock external services** (Razorpay, OAuth)
- **Database cleanup** between tests
- **Test environment** isolation

## 🤝 Decision Making Process

When facing architectural decisions:

1. **Research** current best practices
2. **Consider** free tier constraints
3. **Evaluate** maintenance complexity
4. **Discuss** with human developer
5. **Document** chosen approach and reasoning
6. **Implement** with comprehensive error handling
7. **Test** thoroughly before marking complete

## 💡 Learning Objectives

This project should demonstrate:

- **Modern backend architecture** patterns
- **Cost-effective** cloud service usage
- **Production-ready** code quality
- **Scalable** system design
- **Industry-standard** development practices

---

**Remember**: The goal is creating a learning resource that showcases professional backend development while being cost-effective and maintainable.
