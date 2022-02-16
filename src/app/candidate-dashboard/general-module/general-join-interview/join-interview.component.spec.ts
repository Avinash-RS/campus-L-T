import { NO_ERRORS_SCHEMA } from "@angular/core";
import { GeneralJoinInterviewComponent } from "./join-interview.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("JoinInterviewComponent", () => {

  let fixture: ComponentFixture<GeneralJoinInterviewComponent>;
  let component: GeneralJoinInterviewComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [GeneralJoinInterviewComponent]
    });

    fixture = TestBed.createComponent(GeneralJoinInterviewComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });

});
