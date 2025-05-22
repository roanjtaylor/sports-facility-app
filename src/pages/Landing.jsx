import { MainLayout, Container } from '../components/layout';
import { Card, Button } from '../components/common';

function Landing() {
  return (
    <MainLayout>
      <Container className="py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Sports Facility Platform
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card padding="p-8" hover>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">For Facility Owners</h2>
            <p className="mb-6 text-gray-600">Manage your sports facilities effortlessly</p>
            <Button className="w-full">Get Started</Button>
          </Card>
          <Card padding="p-8" hover>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">For Players</h2>
            <p className="mb-6 text-gray-600">Find and book sports facilities easily</p>
            <Button variant="secondary" className="w-full">
              Find Games
            </Button>
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}

export default Landing;
