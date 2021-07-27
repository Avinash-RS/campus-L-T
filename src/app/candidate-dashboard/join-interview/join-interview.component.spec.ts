import { NO_ERRORS_SCHEMA } from "@angular/core";
import { JoinInterviewComponent } from "./join-interview.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("JoinInterviewComponent", () => {

  let fixture: ComponentFixture<JoinInterviewComponent>;
  let component: JoinInterviewComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [JoinInterviewComponent]
    });

    fixture = TestBed.createComponent(JoinInterviewComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
