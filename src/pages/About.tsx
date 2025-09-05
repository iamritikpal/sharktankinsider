import { Target, Users, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const stats = [
    {
      icon: Users,
      value: '5K+',
      label: 'Happy Customers',
      description: 'Trust our product recommendations'
    },
    {
      icon: Award,
      value: '50+',
      label: 'Curated Products',
      description: 'From successful Shark Tank entrepreneurs'
    },
    {
      icon: TrendingUp,
      value: '₹1L+',
      label: 'Savings Generated',
      description: 'Through exclusive deals and offers'
    },
    {
      icon: Target,
      value: '10+',
      label: 'Brand Partners',
      description: 'Featured on Shark Tank India'
    }
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      description: 'Former startup founder with 10+ years in e-commerce and affiliate marketing.',
      image: '/placeholder.svg'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Head of Partnerships',
      description: 'Expert in building relationships with Shark Tank entrepreneurs and brands.',
      image: '/placeholder.svg'
    },
    {
      name: 'Anita Patel',
      role: 'Content Director',
      description: 'Specialist in creating engaging content about startup success stories.',
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            About SharkDeals
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            We're passionate about connecting you with innovative products from India's most 
            successful Shark Tank entrepreneurs, while sharing their inspiring success stories.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground">
                Democratizing access to innovative products while celebrating entrepreneurial success
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Why We Started</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  After watching countless episodes of Shark Tank India, we noticed that many viewers 
                  wanted to support these amazing entrepreneurs but struggled to find their products 
                  or learn more about their journeys.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Sharktankinsider was born from this need - to create a centralized platform where 
                  you can discover, learn about, and purchase products from India's most innovative 
                  startups featured on Shark Tank.
                </p>
                <h3 className="text-2xl font-semibold mb-4">What We Do</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Curate the best products from Shark Tank entrepreneurs
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Negotiate exclusive deals and discounts for our community
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Share inspiring success stories and business insights
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Support Indian startups and entrepreneurship ecosystem
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-card rounded-lg p-8 shadow-card">
                <h3 className="text-2xl font-semibold mb-6">Our Values</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Transparency</h4>
                    <p className="text-sm text-muted-foreground">
                      We're upfront about our affiliate partnerships and always prioritize your best interests.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Quality</h4>
                    <p className="text-sm text-muted-foreground">
                      Every product we feature is carefully vetted for quality, innovation, and value.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Community</h4>
                    <p className="text-sm text-muted-foreground">
                      We're building a community of entrepreneurship enthusiasts and smart shoppers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Innovation</h4>
                    <p className="text-sm text-muted-foreground">
                      We celebrate and promote products that solve real problems with innovative solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-muted-foreground">
              Numbers that reflect our commitment to the entrepreneur community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-lg mb-4">
                    <stat.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold mb-2">{stat.label}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section removed as requested */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Be part of India's growing community of entrepreneurship enthusiasts. 
              Discover amazing products and inspiring stories.
            </p>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;